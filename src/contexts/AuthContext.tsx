import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';

export interface UserProfile extends User {
  student_profile?: {
    student_id: string;
    is_approved: boolean;
    full_name: string;
  };
  is_admin?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  deviceError: string | null;
  isDeviceActive: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  deviceError: null,
  isDeviceActive: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [deviceError, setDeviceError] = useState<string | null>(null);
  const [isDeviceActive, setIsDeviceActive] = useState<boolean>(true);
  const [deviceToken] = useState(() => {
    let token = localStorage.getItem('dm_device_token');
    if (!token) {
      token = uuidv4();
      localStorage.setItem('dm_device_token', token);
    }
    return token;
  });

  const checkDeviceLimit = async (userId: string) => {
    setDeviceError(null);
    try {
      // 1. Get max_devices for user
      const { data: profile } = await supabase
        .from('student_profiles')
        .select('max_devices')
        .eq('id', userId)
        .single();

      const maxDevices = profile?.max_devices || 1;

      // 2. Check if this device is already registered
      const { data: existingSession } = await supabase
        .from('device_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('device_token', deviceToken)
        .single();

      if (existingSession) {
        // Device is registered, update last active
        await supabase
          .from('device_sessions')
          .update({ last_active_at: new Date().toISOString() })
          .eq('id', existingSession.id);
        return true;
      }

      // 3. If not registered, count current devices
      const { count } = await supabase
        .from('device_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (count !== null && count >= maxDevices) {
        setDeviceError(`Device limit reached. You can only use ${maxDevices} device(s).`);
        await supabase.auth.signOut();
        return false;
      }

      // 4. Register new device
      const { error: insertError } = await supabase
        .from('device_sessions')
        .insert([{ user_id: userId, device_token: deviceToken }]);

      if (insertError) {
        setDeviceError('Failed to register device.');
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error checking device limit:', err);
      return true; // fail open if db error
    }
  };

  const fetchProfile = async (authUser: User | null) => {
    if (!authUser) {
      setUser(null);
      return;
    }

    try {
      // Check if user is admin
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', authUser.id)
        .single();

      const isAdmin = !!adminData;

      // Check for student profile
      const { data: profileData, error: profileError } = await supabase
        .from('student_profiles')
        .select('student_id, is_approved, full_name')
        .eq('id', authUser.id)
        .single();

      if (!profileError && profileData) {
        setUser({ ...authUser, student_profile: profileData, is_admin: isAdmin });
      } else {
        setUser({ ...authUser, is_admin: isAdmin });
      }
    } catch (e) {
      console.error('Error fetching user details:', e);
      setUser(authUser);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const allowed = await checkDeviceLimit(session.user.id);
        if (allowed) await fetchProfile(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        const allowed = await checkDeviceLimit(session.user.id);
        if (allowed) await fetchProfile(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Heartbeat & Concurrency Check
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      // 1. Update this device's last_active_at
      await supabase
        .from('device_sessions')
        .update({ last_active_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('device_token', deviceToken);

      // 2. Check if another device is active (pinged in the last 60 seconds)
      const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();
      const { data: otherActive } = await supabase
        .from('device_sessions')
        .select('id')
        .eq('user_id', user.id)
        .neq('device_token', deviceToken)
        .gte('last_active_at', oneMinuteAgo)
        .limit(1);

      if (otherActive && otherActive.length > 0) {
        setIsDeviceActive(false);
      } else {
        setIsDeviceActive(true);
      }

    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [user, deviceToken]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, deviceError, isDeviceActive }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
