import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdamaLogo } from '../../components/common/AdamaLogo';
import { GoogleAuthModal } from '../../components/common/GoogleAuthModal';
import { ADAMA_KEBELES, ADAMA_WOREDAS } from '../../data/mockData';
import { UserRole } from '../../types';
import { UserCheck, ArrowLeft, Building2, Heart, User, CheckCircle2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

interface RegisterPageProps {
  onGoToLogin: () => void;
  onBackToLanding?: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onGoToLogin, onBackToLanding }) => {
  const [role, setRole] = useState<UserRole>('DONOR');
  const [donorType, setDonorType] = useState<'INDIVIDUAL' | 'NGO'>('INDIVIDUAL');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [kebele, setKebele] = useState(ADAMA_KEBELES[0]);
  const [woreda, setWoreda] = useState(ADAMA_WOREDAS[0]);
  const [nationalId, setNationalId] = useState('');
  const [orgName, setOrgName] = useState('');
  const [orgRegNumber, setOrgRegNumber] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          password,
          role,
          kebele: role === 'BENEFICIARY' ? kebele : undefined,
          woreda: role === 'BENEFICIARY' ? woreda : undefined,
          city: 'Adama',
          nationalIdNumber: nationalId || undefined,
          orgName: orgName || undefined,
          orgRegNumber: orgRegNumber || undefined,
          donorType: role === 'DONOR' ? donorType : undefined,
        }),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('auth_token', data.data.token);
        onGoToLogin();
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Accent glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

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

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2 z-10">
        <AdamaLogo
          size="lg"
          lightText={true}
          className="justify-center"
          onClick={onBackToLanding}
          title="Click to return to Public Landing Page"
        />
        <h2 className="text-xl font-black text-white tracking-tight">Citizen & Donor Registration</h2>
        <p className="text-xs text-slate-400">Join the Adama Digitized Support Network</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white border border-slate-200 py-8 px-6 shadow-2xl rounded-2xl space-y-5 text-xs text-slate-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}
            {/* Role Selection */}
            <div>
              <label className="block font-bold mb-1.5 text-slate-700">Account Type *</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('DONOR')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2 ${
                    role === 'DONOR'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Heart className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold text-xs">Donor Contributor</p>
                    <p className="text-[10px] text-slate-500 font-normal">Individual / NGO</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('BENEFICIARY')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2 ${
                    role === 'BENEFICIARY'
                      ? 'bg-amber-50 border-amber-500 text-amber-900 font-bold shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <User className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <p className="font-bold text-xs">Citizen Beneficiary</p>
                    <p className="text-[10px] text-slate-500 font-normal">Adama Resident</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Donor Sub-type Selector */}
            {role === 'DONOR' && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-[11px] font-bold text-slate-700">Donor Category</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer">
                    <input
                      type="radio"
                      name="donorCategory"
                      checked={donorType === 'INDIVIDUAL'}
                      onChange={() => setDonorType('INDIVIDUAL')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-semibold text-xs">Individual / Diaspora</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer">
                    <input
                      type="radio"
                      name="donorCategory"
                      checked={donorType === 'NGO'}
                      onChange={() => setDonorType('NGO')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-semibold text-xs">NGO / Organization</span>
                  </label>
                </div>
              </div>
            )}

            <div>
              <label className="block font-bold mb-1 text-slate-700">Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Chaltu Dejene Gudeta"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1 text-slate-700">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700">Phone Number *</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+251 9..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1 text-slate-700">Password *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
                required
                minLength={6}
              />
            </div>

            {role === 'BENEFICIARY' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1 text-slate-700">Kebele Residence *</label>
                    <select
                      value={kebele}
                      onChange={(e) => setKebele(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    >
                      {ADAMA_KEBELES.map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-slate-700">Sub-City Woreda *</label>
                    <select
                      value={woreda}
                      onChange={(e) => setWoreda(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    >
                      {ADAMA_WOREDAS.map((w) => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700">National ID / Kebele FIN Number *</label>
                  <input
                    type="text"
                    placeholder="E.g. FIN-39820-ADA"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    required
                  />
                </div>
              </>
            )}

            {role === 'DONOR' && donorType === 'NGO' && (
              <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="block font-bold mb-1 text-slate-700">Organization / NGO Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Adama Youth Vision Charity"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-slate-700">NGO Registration Number</label>
                  <input
                    type="text"
                    placeholder="e.g. NGO/ADA/2024/089"
                    value={orgRegNumber}
                    onChange={(e) => setOrgRegNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
              </div>
            )}

            <p className="text-[10px] text-slate-500 leading-tight">
              Note: Government administrator accounts are invite-only and provisioned directly by City & System Administrators.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-sm shadow-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Registering...</span>
                </div>
              ) : (
                'Register & Complete Setup'
              )}
            </button>
          </form>

          {/* Divider & Google Register */}
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-extrabold">
              <span className="bg-white px-3 text-slate-400">Or Fast Track With</span>
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
            <span>Register with Google Account</span>
          </button>

          <div className="text-center pt-2 border-t border-slate-100">
            <button onClick={onGoToLogin} className="text-xs text-emerald-700 font-bold hover:underline">
              ← Already registered? Back to Login
            </button>
          </div>
        </div>
      </div>

      <GoogleAuthModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        defaultRole={role === 'DONOR' && donorType === 'NGO' ? 'NGO_ORGANIZATION' : role}
        mode="REGISTER"
      />
    </div>
  );
};
