import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdamaLogo } from '../../components/common/AdamaLogo';
import { GoogleAuthModal } from '../../components/common/GoogleAuthModal';
import { UserRole } from '../../types';
import { ShieldCheck, LogIn, Sparkles, KeyRound, Building2, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface LoginPageProps {
  onGoToRegister: () => void;
  onBackToLanding?: () => void;
  initialRoleHint?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onGoToRegister, onBackToLanding, initialRoleHint }) => {
  const { login, loading, error: authError, clearError } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'CITIZEN_DONOR' | 'UNIFIED_ADMIN'>(
    initialRoleHint === 'admin' || initialRoleHint?.includes('ADMIN') ? 'UNIFIED_ADMIN' : 'CITIZEN_DONOR'
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Forgot password modal
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    clearError();
    const ok = await login(email, password);
    if (!ok) {
      setError('Invalid credentials. Please check your email and password.');
    }
  };

  const handleQuickRoleSelect = (role: UserRole) => {
    // Pre-fill email based on role for demo purposes
    const roleEmails: Record<UserRole, string> = {
      DONOR: 'donor@adama.gov.et',
      BENEFICIARY: 'chaltu.dejene@gmail.com',
      KEBELE_ADMIN: 'kebele05@adama.gov.et',
      WOREDA_ADMIN: 'woreda.bole@adama.gov.et',
      CITY_ADMIN: 'cityadmin@adama.gov.et',
      SYSTEM_ADMIN: 'sysadmin@adama.gov.et',
    };
    setEmail(roleEmails[role]);
    setPassword('password'); // Demo password
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResetSent(true);
    setTimeout(() => {
      setResetSent(false);
      setShowForgotPassword(false);
      setResetEmail('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Accent glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Back to Landing link if provided */}
      {onBackToLanding && (
        <div className="absolute top-6 left-6 z-20">
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700 transition-all font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>Back to Public Portal</span>
          </button>
        </div>
      )}

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 space-y-3">
        <AdamaLogo
          size="xl"
          lightText={true}
          className="justify-center"
          onClick={onBackToLanding}
          title="Click to return to Public Landing Page"
        />
        <h2 className="text-xl font-black text-white tracking-tight">
          Adama City Support Portal
        </h2>
        <p className="text-xs text-slate-400">
          Bulchiinsa Magaalaa Adaamaa • አዳማ ከተማ አስተዳደር
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white border border-slate-200 py-6 px-6 shadow-2xl rounded-2xl space-y-5">
          {/* Main Auth Tabs: Citizen/Donor vs Unified Admin */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('CITIZEN_DONOR')}
              className={`py-2 rounded-lg transition-all ${
                activeTab === 'CITIZEN_DONOR'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Donor & Citizen Login
            </button>
            <button
              onClick={() => setActiveTab('UNIFIED_ADMIN')}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'UNIFIED_ADMIN'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Unified Admin Entry</span>
            </button>
          </div>

          {activeTab === 'UNIFIED_ADMIN' && (
            <div className="p-3 bg-slate-900 text-slate-300 rounded-xl border border-slate-800 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-[11px] uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                <span>Municipal Unified Admin Portal</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Single sign-in entry point for Kebele, Woreda, City Cabinet, and System IT Administrators. Post-login JWT grants role permissions.
              </p>
            </div>
          )}

          {/* Quick Demo Role Switcher Bar */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Quick Role Demo Switcher</span>
              </span>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                1-Click Login
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {activeTab === 'CITIZEN_DONOR' ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleQuickRoleSelect('DONOR')}
                    className="p-2 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition-all"
                  >
                    <p className="font-bold text-slate-800 text-[11px]">Individual Donor</p>
                    <p className="text-[9px] text-slate-500 font-mono">donor@adama.gov.et</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickRoleSelect('DONOR')}
                    className="p-2 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition-all"
                  >
                    <p className="font-bold text-slate-800 text-[11px]">NGO / Org Donor</p>
                    <p className="text-[9px] text-slate-500 font-mono">contact@adamayouth.org</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickRoleSelect('BENEFICIARY')}
                    className="p-2 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl text-left transition-all col-span-2"
                  >
                    <p className="font-bold text-slate-800 text-[11px]">Beneficiary Citizen</p>
                    <p className="text-[9px] text-slate-500 font-mono">chaltu.dejene@gmail.com</p>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleQuickRoleSelect('KEBELE_ADMIN')}
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-left transition-all border border-slate-700"
                  >
                    <p className="font-bold text-[11px] text-amber-400">Kebele Admin</p>
                    <p className="text-[9px] text-slate-400 font-mono">kebele05@adama.gov.et</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickRoleSelect('WOREDA_ADMIN')}
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-left transition-all border border-slate-700"
                  >
                    <p className="font-bold text-[11px] text-emerald-400">Woreda Supervisor</p>
                    <p className="text-[9px] text-slate-400 font-mono">woreda.bole@adama.gov.et</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickRoleSelect('CITY_ADMIN')}
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-left transition-all border border-slate-700"
                  >
                    <p className="font-bold text-[11px] text-indigo-400">City Cabinet Admin</p>
                    <p className="text-[9px] text-slate-400 font-mono">cityadmin@adama.gov.et</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickRoleSelect('SYSTEM_ADMIN')}
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-left transition-all border border-slate-700"
                  >
                    <p className="font-bold text-[11px] text-blue-400">System IT Admin</p>
                    <p className="text-[9px] text-slate-400 font-mono">sysadmin@adama.gov.et</p>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleStandardLogin} className="space-y-3.5">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {activeTab === 'UNIFIED_ADMIN' ? 'Government Admin Email' : 'Email or Phone Number'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden transition-all"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-[11px] text-emerald-700 font-semibold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 ${
                activeTab === 'UNIFIED_ADMIN'
                  ? 'bg-slate-900 hover:bg-slate-800'
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-200'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>
                    {activeTab === 'UNIFIED_ADMIN' ? 'Authenticate Official Admin' : 'Log In To Portal'}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Divider & Google Sign-In */}
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-extrabold">
              <span className="bg-white px-3 text-slate-400">Or Continue With</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-extrabold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2.5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google Account</span>
          </button>

          <div className="text-center pt-1 border-t border-slate-100">
            <button
              type="button"
              onClick={onGoToRegister}
              className="text-xs text-emerald-700 font-bold hover:underline"
            >
              Don't have an account? Register as New Citizen or Donor →
            </button>
          </div>
        </div>
      </div>

      {/* Google Auth Modal */}
      <GoogleAuthModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        mode="LOGIN"
      />

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">Reset Account Password</h3>
              </div>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {resetSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Reset SMS & Email link dispatched!</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-3.5">
                <p className="text-xs text-slate-600">
                  Enter your registered government email or Ethio Telecom phone number to receive an instant OTP reset code.
                </p>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email / Phone</label>
                  <input
                    type="text"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="donor@adama.gov.et or +251 9..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-xs"
                >
                  Send Recovery Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
