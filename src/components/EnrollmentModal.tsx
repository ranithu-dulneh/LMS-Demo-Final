import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles, GraduationCap, Building2 } from 'lucide-react';
import { Institution } from './InstitutionSelectModal';
import { supabase } from '../lib/supabase';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedInstitute?: Institution | null;
  onChangeInstitute?: () => void;
}

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  isOpen,
  onClose,
  selectedInstitute,
  onChangeInstitute
}) => {
  const [batches, setBatches] = useState<any[]>([]);
  const [mediums, setMediums] = useState<any[]>([]);

  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [selectedStream, setSelectedStream] = useState<'Theory' | 'Revision' | 'Paper Class' | 'All In One'>('All In One');
  const [medium, setMedium] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [district, setDistrict] = useState<string>('Colombo');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedStudentId, setGeneratedStudentId] = useState<string>('');

  useEffect(() => {
    const fetchOptions = async () => {
      const [batchRes, medRes] = await Promise.all([
        supabase.from('intake_batches').select('*').order('created_at', { ascending: true }),
        supabase.from('mediums').select('*').order('created_at', { ascending: true })
      ]);
      if (batchRes.data) {
        setBatches(batchRes.data);
        if (batchRes.data.length > 0) setSelectedBatch(batchRes.data[0].id);
      }
      if (medRes.data) {
        setMediums(medRes.data);
        if (medRes.data.length > 0) setMedium(medRes.data[0].id);
      }
    };
    fetchOptions();
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Generate a temporary student ID for the auth metadata.
      // The database trigger handle_new_user() will generate the real one.
      const tempStudentId = 'TBD';

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: studentName,
            student_id: tempStudentId,
            institution_id: selectedInstitute?.id,
            batch_id: selectedBatch,
            medium_id: medium,
            course_program: selectedStream,
            mobile_number: phone,
            district: district
          }
        }
      });

      if (signUpError) throw signUpError;

      // Registration successful
      setIsSubmitted(true);

      // Fetch the actual generated student_id if we have the user
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

    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative flex flex-col w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/80 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 bg-white/70">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                Official Enrollment 2026/2027
              </span>
              <h3 className="text-base font-bold text-slate-900">Student Sign Up &amp; Registration</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Enrollment Submitted!</h4>
            <p className="text-sm text-slate-600 max-w-xs mx-auto">
              Welcome to {selectedInstitute?.name || 'Inspire Education'}. Your account has been created successfully and is pending admin approval.
            </p>
            {generatedStudentId && (
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <span className="block text-sm text-blue-800 font-medium mb-1">Your Student ID</span>
                <span className="block text-2xl font-bold text-blue-900 tracking-wider">{generatedStudentId}</span>
              </div>
            )}
            <div className="p-3 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-600 font-medium">
              You will be able to log in once your account is approved.
            </div>
            <div className="pt-4">
               <button onClick={onClose} className="inline-block px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors w-full">
                 Close
               </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[82vh] overflow-y-auto">

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-100 font-medium">
                {error}
              </div>
            )}

            {/* Selected Center Pill / Card */}
            {selectedInstitute && (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                    {selectedInstitute.name.charAt(0)}
                  </div>
                  <div className="min-w-0 text-left">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-slate-900 truncate">{selectedInstitute.name}</p>
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Selected Center
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">{selectedInstitute.location}</p>
                  </div>
                </div>
                {onChangeInstitute && (
                  <button
                    type="button"
                    onClick={onChangeInstitute}
                    className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold underline shrink-0 ml-2"
                  >
                    Change
                  </button>
                )}
              </div>
            )}
            {/* Batch Selector */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">Target Academic Batch</label>
              <div className="grid grid-cols-2 gap-2">
                {batches.length === 0 && <span className="text-[11px] text-slate-500">Loading...</span>}
                {batches.map(b => (
                  <button
                    type="button"
                    key={b.id}
                    onClick={() => setSelectedBatch(b.id)}
                    className={`py-2 px-3 rounded-xl border font-semibold text-center transition-all ${
                      selectedBatch === b.id
                        ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs'
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
              <label className="font-semibold text-slate-700 block mb-1.5">Language Medium</label>
              <div className="grid grid-cols-3 gap-2">
                {mediums.length === 0 && <span className="text-[11px] text-slate-500">Loading...</span>}
                {mediums.map(m => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setMedium(m.id)}
                    className={`py-2 px-2 rounded-xl border font-medium text-center transition-all ${
                      medium === m.id
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Course Stream */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">Course Program</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Theory', 'Revision', 'Paper Class', 'All In One'] as const).map(s => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setSelectedStream(s)}
                    className={`py-2 px-3 rounded-xl border text-left transition-all ${
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

            {/* Student Details */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Ruwanthi Jayasinghe"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">WhatsApp Mobile</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="077 123 4567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">District</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 text-xs"
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
                <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-white font-semibold apple-button-primary shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>Complete Free Enrollment</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-[11px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>Instant access credentials dispatched within 3 minutes</span>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
