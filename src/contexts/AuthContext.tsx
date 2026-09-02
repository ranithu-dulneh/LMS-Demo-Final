import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
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
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

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
        await fetchProfile(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        await fetchProfile(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
