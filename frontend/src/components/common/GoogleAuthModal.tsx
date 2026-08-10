import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Shield, CheckCircle2, User, Heart, Sparkles } from 'lucide-react';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
  mode?: 'LOGIN' | 'REGISTER';
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'DONOR',
  mode = 'LOGIN',
}) => {
  const { loginWithGoogle } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      await loginWithGoogle({
        idToken: credentialResponse.credential,
        role: selectedRole,
      });
      onClose();
    } catch (error: any) {
      console.error('Google auth error:', error);
      alert(error.message || 'Google authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden space-y-0 animate-in fade-in zoom-in duration-200">
        {/* Google Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-sm bg-slate-200/60 hover:bg-slate-200 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          >
            ✕
          </button>

          <div className="flex justify-center mb-3">
            {/* Standard Google G Logo SVG */}
            <svg className="w-10 h-10" viewBox="0 0 24 24">
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
          </div>

          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            {mode === 'REGISTER' ? 'Register with Google Account' : 'Sign in with Google'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Continue to <span className="font-bold text-slate-800">Adama Support Portal</span>
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {/* Role Choice if Registering */}
          {mode === 'REGISTER' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-700">
                Registering As Account Type:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedRole('DONOR')}
                  className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all ${
                    selectedRole === 'DONOR'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Donor Contributor</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('BENEFICIARY')}
                  className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all ${
                    selectedRole === 'BENEFICIARY'
                      ? 'bg-amber-50 border-amber-500 text-amber-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  <span>Citizen Beneficiary</span>
                </button>
              </div>
            </div>
          )}

          {/* Google Login Button */}
          <div className="pt-2">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                console.error('Google Login Failed');
                setIsLoading(false);
              }}
              theme="outline"
              size="large"
              text={mode === 'REGISTER' ? 'signup_with' : 'signin_with'}
              shape="rectangular"
            />
          </div>

          {isLoading && (
            <p className="text-xs text-center text-slate-500">
              Authenticating with Google...
            </p>
          )}

          <p className="text-[10px] text-center text-slate-400 leading-tight">
            Protected by Google Identity Service. Adama City Administration receives name, email address, and profile picture.
          </p>
        </div>
      </div>
    </div>
  );
};
