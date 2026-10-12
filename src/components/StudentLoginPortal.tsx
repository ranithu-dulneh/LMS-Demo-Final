import React, { useState } from 'react';
import { CurrentUser, ActiveTab } from '../types';
import { initialUser } from '../data/mockData';
import { InspireLogo } from './InspireLogo';
import { Institution } from './InstitutionSelectModal';
import {
  Eye,
  EyeOff,
  BookOpen,
  Video,
  Users,
  FileText,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Lock,
  ArrowRight
} from 'lucide-react';

interface StudentLoginPortalProps {
  onLoginSuccess?: (user: CurrentUser) => void;
  overrideLogin?: (id: string, pass: string) => Promise<string | null>;
  externalError?: string;
  onNavigate: (tab: ActiveTab) => void;
  selectedInstitute?: Institution | null;
  onOpenSignUp?: () => void;
}

export const StudentLoginPortal: React.FC<StudentLoginPortalProps> = ({
  onLoginSuccess,
  overrideLogin,
  externalError,
  onNavigate,
  selectedInstitute,
  onOpenSignUp
}) => {
  const [loginMethod, setLoginMethod] = useState<'id' | 'mobile'>('id');
  const [identifier, setIdentifier] = useState<string>(''); // removed dummy data
  const [password, setPassword] = useState<string>(''); // removed dummy data
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (externalError) {
      setErrorMsg(externalError);
    }
  }, [externalError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMsg('Please enter your Student ID or Mobile Number');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);

    if (overrideLogin) {
      const err = await overrideLogin(identifier, password);
      if (err) {
        setErrorMsg(err);
        setIsLoading(false);
      }
    } else {
      setTimeout(() => {
        setIsLoading(false);
        if (onLoginSuccess) {
            onLoginSuccess({
                ...initialUser,
                indexNumber: identifier
            });
        }
        onNavigate('lms');
      }, 600);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-2 sm:p-4 my-2 sm:my-6">
      {/* Outer Split Card matching Screenshot 2026-10-06 at 23.47.52.png */}
      <div className="w-full max-w-6xl rounded-[32px] sm:rounded-[40px] overflow-hidden bg-white shadow-2xl border border-slate-200/80 grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">

        {/* ─────────────────────────────────────────────────────────────
            LEFT COLUMN: Darkened poster with gradient and benefits
           ───────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-5 xl:col-span-6 relative bg-slate-950 text-white p-8 sm:p-12 flex flex-col justify-between overflow-hidden">

          {/* Background Poster Artwork with Dark Gradient Overlay */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            {/* Multi-layered dark emerald and sapphire gradients simulating image.png effects */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-900/60 z-10" />

            {/* Visual representation of image.png poster */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#15803d_0%,#064e3b_35%,#022c22_70%,#020617_100%)] opacity-80" />

            {/* Poster graphic elements & purple/green spotlight circles matching image.png */}
            <div className="absolute top-1/4 -right-16 w-80 h-80 rounded-full bg-purple-700/30 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-96 h-96 rounded-full bg-emerald-600/25 blur-3xl pointer-events-none" />

            {/* Poster watermarks */}
            <div className="absolute inset-0 opacity-10 flex flex-col justify-center items-center pointer-events-none select-none font-black text-6xl text-white tracking-widest leading-none">
              <span>ACCOUNTING</span>
              <span>PARTNERSHIP</span>
              <span>ENGLISH MEDIUM</span>
            </div>
          </div>

          {/* Top Brand bar */}
          <div className="relative z-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <InspireLogo size="md" variant="dark" />
              <div className="border-l border-white/20 pl-3">
                <span className="text-xs font-bold text-white block">Inspire Education</span>
                <span className="text-[10px] text-emerald-400 font-medium block">
                  by Mrs. Ruwanthi Senanayaka
                </span>
              </div>
            </div>

            {selectedInstitute && (
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-sans font-medium text-emerald-300 border border-emerald-500/30">
                {selectedInstitute.name}
              </span>
            )}
          </div>

          {/* Center: Title & Value Propositions */}
          <div className="relative z-20 space-y-6 my-auto py-8 text-left">

            {/* Handwritten script effect */}
            <div className="inline-block transform -rotate-1">
              <span className="text-amber-400 text-lg sm:text-xl font-bold tracking-wide italic font-serif">
                The Sleepless Accounting Masterclass
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                Master Accounting. <br />
                <span className="text-emerald-400">Ace your A/Ls.</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
                Join 100,000+ students learning with Sri Lanka's most comprehensive A/L Accounting platform.
              </p>
            </div>

            {/* 3 Value Propositions with Glass Icons matching screenshot */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center shrink-0 text-emerald-400">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Expert Video Lessons</h4>
                  <p className="text-[11px] sm:text-xs text-slate-300">
                    HD recorded lectures by Mrs. Ruwanthi Senanayaka
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center shrink-0 text-emerald-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Live Interactive Classes</h4>
                  <p className="text-[11px] sm:text-xs text-slate-300">
                    Real-time sessions with instant doubt clearing
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center shrink-0 text-emerald-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">LKAS Theory Standards &amp; Tutes</h4>
                  <p className="text-[11px] sm:text-xs text-slate-300">
                    Structured marking schemes and comprehensive revision guides
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="relative z-20 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span>© 2026 Inspire Education. All rights reserved.</span>
            <span className="text-slate-400 font-sans">Official Student Portal</span>
          </div>

        </div>

        {/* ─────────────────────────────────────────────────────────────
            RIGHT COLUMN: Clean Sign In Form matching Screenshot
           ───────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-7 xl:col-span-6 bg-white p-8 sm:p-14 flex flex-col justify-center text-left">

          <div className="max-w-md w-full mx-auto space-y-7">

            {/* Header */}
            <div className="space-y-2 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                Welcome back
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Sign in to continue your learning journey
              </p>
            </div>

            {/* Segmented Toggle: [ Student ID / Barcode ID | Mobile Number ] */}
            <div className="p-1 rounded-2xl bg-slate-100 flex items-center text-xs font-semibold border border-slate-200/80">
              <button
                type="button"
                onClick={() => setLoginMethod('id')}
                className={`flex-1 py-2.5 rounded-xl transition-all ${
                  loginMethod === 'id'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Student ID / Barcode ID
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('mobile')}
                className={`flex-1 py-2.5 rounded-xl transition-all ${
                  loginMethod === 'mobile'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mobile Number
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Identifier Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {loginMethod === 'id' ? 'Student ID / Barcode ID' : 'Mobile Number'}
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={loginMethod === 'id' ? 'Enter your Student ID / Barcode ID' : '077 123 4567'}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-sans"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-4 pr-11 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-sans"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-slate-400" />}
                  </button>
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>
              )}

              {/* Sign In Button (Emerald Green matching screenshot) */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all duration-200 hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>

            {/* Links matching screenshot */}
            <div className="text-center space-y-3 pt-2 text-xs">
              {infoMsg && (
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-800 text-xs text-center border border-blue-200">
                  {infoMsg}
                </div>
              )}

              <button
                type="button"
                onClick={() => setInfoMsg('To reset your password, please contact the student helpline or WhatsApp support (+94 77 123 4567).')}
                className="text-emerald-700 hover:text-emerald-800 font-bold block mx-auto transition-colors"
              >
                Forgot password?
              </button>

              <p className="text-slate-500">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onOpenSignUp}
                  className="text-emerald-700 hover:text-emerald-800 font-bold underline transition-colors"
                >
                  Create account
                </button>
              </p>
            </div>

            {/* One-click Demo Helper */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setIdentifier('2024-8901');
                  setPassword('Inspire@2025');
                }}
                className="text-[11px] text-slate-400 hover:text-slate-600 font-sans underline"
              >
                Use Demo Account (ID: 2024-8901)
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
