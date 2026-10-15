import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Sparkles, GraduationCap } from 'lucide-react';
import { supabase } from '../lib/supabase';

const SignupPage: React.FC = () => {
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [mediums, setMediums] = useState<any[]>([]);

  const [selectedInst, setSelectedInst] = useState<string>('');
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [selectedStream, setSelectedStream] = useState<'Theory' | 'Revision' | 'Paper Class' | 'All In One'>('All In One');
  const [selectedMedium, setSelectedMedium] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [district, setDistrict] = useState<string>('Colombo');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [generatedStudentId, setGeneratedStudentId] = useState<string>('');

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const [instRes, batchRes, medRes] = await Promise.all([
        supabase.from('institutions').select('*').order('created_at', { ascending: true }),
        supabase.from('intake_batches').select('*').order('created_at', { ascending: true }),
        supabase.from('mediums').select('*').order('created_at', { ascending: true })
      ]);
      if (instRes.data) {
        setInstitutions(instRes.data);
        if (instRes.data.length > 0) setSelectedInst(instRes.data[0].id);
      }
      if (batchRes.data) {
        setBatches(batchRes.data);
        if (batchRes.data.length > 0) setSelectedBatch(batchRes.data[0].id);
      }
      if (medRes.data) {
        setMediums(medRes.data);
        if (medRes.data.length > 0) setSelectedMedium(medRes.data[0].id);
      }
    } catch (err) {
      console.error('Failed to load signup options:', err);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: studentName,
            institution_id: selectedInst || null,
            batch_id: selectedBatch || null,
            medium_id: selectedMedium || null,
            course_program: selectedStream,
            mobile_number: phone,
            district: district
          }
        }
      });

      if (signUpError) throw signUpError;

      // Because the trigger handles ID generation, we can wait a brief moment and fetch it
      if (data.user) {
        const { data: profile } = await supabase
          .from('student_profiles')
          .select('student_id')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          setGeneratedStudentId(profile.student_id);
        }
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-24">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">

        {/* Header Ribbon */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Official Enrollment
              </span>
              <h3 className="text-lg font-bold text-slate-900">Student Sign Up & Registration</h3>
            </div>
          </div>
          <Link to="/login" className="text-sm font-semibold text-blue-600 hover:text-blue-800">
            Sign In Instead
          </Link>
        </div>

        {isSubmitted ? (
          <div className="p-10 text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-slate-900 mb-2">Enrollment Confirmed!</h4>
              <p className="text-slate-600">
                Welcome to Inspire Education! Your Student Portal login credentials and timetable will be sent via SMS/Email.
              </p>
            </div>
            {generatedStudentId && (
              <div className="inline-block p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <span className="block text-sm text-blue-800 font-medium mb-1">Your Student ID</span>
                <span className="block text-2xl font-bold text-blue-900 tracking-wider">{generatedStudentId}</span>
              </div>
            )}
            <div className="pt-4">
               <Link to="/login" className="inline-block px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">
                 Proceed to Login
               </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="p-6 sm:p-8 space-y-6">

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
                {error}
              </div>
            )}

            {/* Institution Selector */}
            <div>
              <label className="font-semibold text-slate-700 block mb-2">Institution / Center</label>
              <select
                value={selectedInst}
                onChange={(e) => setSelectedInst(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900"
                required
              >
                {institutions.length === 0 && <option value="">Loading...</option>}
                {institutions.map(inst => (
                  <option key={inst.id} value={inst.id}>{inst.name} {inst.location ? `- ${inst.location}` : ''}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Batch Selector */}
              <div>
                <label className="font-semibold text-slate-700 block mb-2">Target Academic Batch</label>
                <div className="grid grid-cols-2 gap-2">
                  {batches.length === 0 && <span className="text-sm text-slate-500">Loading...</span>}
                  {batches.map(b => (
                    <button
                      type="button"
                      key={b.id}
                      onClick={() => setSelectedBatch(b.id)}
                      className={`py-2.5 px-3 rounded-xl border font-semibold text-sm text-center transition-all ${
                        selectedBatch === b.id
                          ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Medium Selector */}
              <div>
                <label className="font-semibold text-slate-700 block mb-2">Language Medium</label>
                <div className="flex gap-2">
                  {mediums.length === 0 && <span className="text-sm text-slate-500">Loading...</span>}
                  {mediums.map(m => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setSelectedMedium(m.id)}
                      className={`flex-1 py-2.5 px-2 rounded-xl border font-medium text-sm text-center transition-all ${
                        selectedMedium === m.id
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Course Stream */}
            <div>
              <label className="font-semibold text-slate-700 block mb-2">Course Program</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Theory', 'Revision', 'Paper Class', 'All In One'] as const).map(s => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setSelectedStream(s)}
                    className={`py-2.5 px-3 rounded-xl border text-sm text-center transition-all ${
                      selectedStream === s
                        ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {s} {s === 'All In One' && '⭐'}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Student Details */}
            <div className="space-y-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Ruwanthi Jayasinghe"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">WhatsApp Mobile</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="077 123 4567"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">District</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900"
                  >
                    <option value="Colombo">Colombo</option>
                    <option value="Gampaha">Gampaha</option>
                    <option value="Kandy">Kandy</option>
                    <option value="Galle">Galle</option>
                    <option value="Kurunegala">Kurunegala</option>
                    <option value="Matara">Matara</option>
                    <option value="Kalutara">Kalutara</option>
                    <option value="Other">Other District / Overseas</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">Confirm Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl text-white font-bold bg-blue-600 hover:bg-blue-700 shadow-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>Complete Enrollment</span>
                    <Sparkles className="w-5 h-5" />
                  </>
                )}
              </button>
              <p className="text-sm text-slate-500 text-center mt-4 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                <span>Instant access credentials dispatched upon success</span>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
