import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { AdamaLogo } from '../../components/common/AdamaLogo';
import {
  User as UserIcon,
  Building2,
  Lock,
  Bell,
  Camera,
  Upload,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  FileText,
  Key,
  Globe,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Sparkles,
  Shield,
  Layers,
  Users,
  Check,
  X,
} from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300',
];

export const UserProfilePage: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeSubTab, setActiveSubTab] = useState<'PERSONAL' | 'ORG_INFO' | 'SECURITY' | 'PREFERENCES'>('PERSONAL');

  // Profile Form State
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [nationalIdNumber, setNationalIdNumber] = useState(currentUser?.nationalIdNumber || '');
  const [city, setCity] = useState(currentUser?.city || 'Adama');
  const [woreda, setWoreda] = useState(currentUser?.woreda || 'Woreda 01');
  const [kebele, setKebele] = useState(currentUser?.kebele || 'Kebele 04');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [address, setAddress] = useState(currentUser?.address || 'Adama City Center, Station Road');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || '');

  // Organization & Official Credentials State
  const [orgName, setOrgName] = useState(currentUser?.orgName || '');
  const [orgRegNumber, setOrgRegNumber] = useState(currentUser?.orgRegNumber || '');
  const [donorType, setDonorType] = useState<'INDIVIDUAL' | 'COMPANY' | 'NGO' | 'DIASPORA'>(
    currentUser?.donorType || 'COMPANY'
  );
  const [taxId, setTaxId] = useState(currentUser?.taxId || '');
  const [website, setWebsite] = useState(currentUser?.website || '');
  const [department, setDepartment] = useState(currentUser?.department || '');
  const [householdSize, setHouseholdSize] = useState<number>(currentUser?.householdSize || 4);

  // Security & Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(currentUser?.twoFactorEnabled ?? true);

  // Preferences
  const [language, setLanguage] = useState<'en' | 'om' | 'am'>(currentUser?.language || 'en');
  const [emailNotifications, setEmailNotifications] = useState(currentUser?.emailNotifications ?? true);
  const [smsNotifications, setSmsNotifications] = useState(currentUser?.smsNotifications ?? true);

  // UX Feedback State
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Sync state if currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setNationalIdNumber(currentUser.nationalIdNumber || '');
      setCity(currentUser.city || 'Adama');
      setWoreda(currentUser.woreda || 'Woreda 01');
      setKebele(currentUser.kebele || 'Kebele 04');
      setBio(currentUser.bio || '');
      setAddress(currentUser.address || 'Adama City Center');
      setAvatarUrl(currentUser.avatarUrl || '');
      setOrgName(currentUser.orgName || '');
      setOrgRegNumber(currentUser.orgRegNumber || '');
      setDonorType(currentUser.donorType || 'COMPANY');
      setTaxId(currentUser.taxId || '');
      setWebsite(currentUser.website || '');
      setDepartment(currentUser.department || '');
      setHouseholdSize(currentUser.householdSize || 4);
      setTwoFactorEnabled(currentUser.twoFactorEnabled ?? true);
      setLanguage(currentUser.language || 'en');
      setEmailNotifications(currentUser.emailNotifications ?? true);
      setSmsNotifications(currentUser.smsNotifications ?? true);
    }
  }, [currentUser]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Avatar Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image file size exceeds 5MB limit. Please choose a smaller photo.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarUrl(result);
        updateProfile({ avatarUrl: result });
        showToast('Profile photo updated successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Preset Avatar Handler
  const handleSelectPresetAvatar = (url: string) => {
    setAvatarUrl(url);
    updateProfile({ avatarUrl: url });
    showToast('Profile picture updated!');
  };

  // Save Profile Changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      updateProfile({
        fullName,
        email,
        phone,
        nationalIdNumber,
        city,
        woreda,
        kebele,
        bio,
        address,
        avatarUrl,
        orgName,
        orgRegNumber,
        donorType,
        taxId,
        website,
        department,
        householdSize,
        twoFactorEnabled,
        language,
        emailNotifications,
        smsNotifications,
      });

      setIsSaving(false);
      showToast('Account profile & organization details saved successfully!');
    }, 600);
  };

  // Password Update Handler
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast('Please enter your current password to confirm changes.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters long.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match. Please verify.', 'error');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password updated securely! Your account is protected.');
    }, 800);
  };

  if (!currentUser) return null;

  const roleTitleMap: Record<UserRole, string> = {
    DONOR: 'Verified Community & Corporate Donor',
    BENEFICIARY: 'Registered Citizen / Beneficiary',
    KEBELE_ADMIN: 'Kebele Verification Officer',
    WOREDA_ADMIN: 'Woreda Regional Supervisor',
    CITY_ADMIN: 'City Executive Board Member',
    SYSTEM_ADMIN: 'System IT Administrator',
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-xs font-extrabold border backdrop-blur-md transition-all transform translate-y-0 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-900/90 text-white border-emerald-500 shadow-emerald-900/30'
              : 'bg-rose-900/90 text-white border-rose-500 shadow-rose-900/30'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 hover:bg-white/20 p-1 rounded-full"
          >
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      )}

      {/* Main Profile Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Background Decorative Pattern */}
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-8">
          <AdamaLogo size="xl" lightText showText={false} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar & Photo Upload Trigger */}
          <div className="relative group shrink-0">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl bg-slate-800 flex items-center justify-center relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-emerald-700/80 text-white font-black text-4xl flex items-center justify-center">
                  {fullName.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Hover overlay button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white text-[11px] font-bold"
                title="Change Profile Photo"
              >
                <Camera className="w-6 h-6 text-emerald-400" />
                <span>Change Photo</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 bg-emerald-500 hover:bg-emerald-400 text-white p-2.5 rounded-2xl shadow-lg border-2 border-slate-900 transition-all cursor-pointer"
              title="Upload New Avatar"
            >
              <Upload className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>

          {/* User Meta & Quick Details */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {currentUser.role.replace('_', ' ')}
              </span>

              {currentUser.isVerified && (
                <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  Verified Identity
                </span>
              )}

              {currentUser.googleConnected && (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  Google OAuth Active
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-black tracking-tight">{fullName}</h1>
            <p className="text-xs text-slate-300 font-medium max-w-xl">
              {roleTitleMap[currentUser.role]} • {currentUser.city || 'Adama'}
              {currentUser.woreda ? `, ${currentUser.woreda}` : ''}
              {currentUser.kebele ? `, ${currentUser.kebele}` : ''}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-mono">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                {email}
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                {phone}
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                ID: {nationalIdNumber || 'ADM-88392'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Photo Selection Quick Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <p className="font-extrabold text-xs text-slate-900">Choose Preset Avatar Photo</p>
            <p className="text-[11px] text-slate-500">Or click the camera icon above to upload your custom image file</p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
          {PRESET_AVATARS.map((url, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectPresetAvatar(url)}
              className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                avatarUrl === url
                  ? 'border-emerald-600 scale-110 shadow-sm shadow-emerald-200 ring-2 ring-emerald-400/50'
                  : 'border-slate-200 hover:border-emerald-400 hover:scale-105'
              }`}
            >
              <img src={url} alt={`Preset ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('PERSONAL')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
            activeSubTab === 'PERSONAL'
              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
              : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Personal Profile</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ORG_INFO')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
            activeSubTab === 'ORG_INFO'
              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
              : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Organization & Credentials</span>
        </button>

        <button
          onClick={() => setActiveSubTab('SECURITY')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
            activeSubTab === 'SECURITY'
              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
              : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Security & Password</span>
        </button>

        <button
          onClick={() => setActiveSubTab('PREFERENCES')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
            activeSubTab === 'PREFERENCES'
              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
              : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Preferences & Language</span>
        </button>
      </div>

      {/* SUB-TAB 1: PERSONAL PROFILE */}
      {activeSubTab === 'PERSONAL' && (
        <form onSubmit={handleSaveProfile} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Personal Information</h2>
              <p className="text-xs text-slate-500">Update your account name, official phone number, address, and jurisdiction</p>
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-sm shadow-emerald-200 transition-all flex items-center gap-2"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Profile</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Full Name */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Full Name *</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-medium text-slate-900 outline-hidden"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Official Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-medium text-slate-900 outline-hidden"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Primary Phone Number (+251) *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-mono text-slate-900 outline-hidden"
                />
              </div>
            </div>

            {/* National ID / Kebele ID */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">National ID / Resident Card Number</label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={nationalIdNumber}
                  onChange={(e) => setNationalIdNumber(e.target.value)}
                  placeholder="e.g. ADM-99201-ETH"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-mono text-slate-900 outline-hidden"
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">City Administration</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-medium text-slate-900 outline-hidden"
                />
              </div>
            </div>

            {/* Woreda */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Sub-City / Woreda District</label>
              <select
                value={woreda}
                onChange={(e) => setWoreda(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-medium text-slate-900 outline-hidden bg-white"
              >
                <option value="Woreda 01">Woreda 01 - Central District</option>
                <option value="Woreda 02">Woreda 02 - East Adama</option>
                <option value="Woreda 03">Woreda 03 - North Industrial District</option>
                <option value="Woreda 04">Woreda 04 - Station South</option>
                <option value="Woreda 05">Woreda 05 - Western Sub-District</option>
              </select>
            </div>

            {/* Kebele */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Local Kebele Jurisdiction</label>
              <select
                value={kebele}
                onChange={(e) => setKebele(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-medium text-slate-900 outline-hidden bg-white"
              >
                <option value="Kebele 01">Kebele 01</option>
                <option value="Kebele 02">Kebele 02</option>
                <option value="Kebele 03">Kebele 03</option>
                <option value="Kebele 04">Kebele 04</option>
                <option value="Kebele 05">Kebele 05</option>
                <option value="Kebele 06">Kebele 06</option>
                <option value="Kebele 07">Kebele 07</option>
                <option value="Kebele 08">Kebele 08</option>
              </select>
            </div>

            {/* Physical Address */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Physical Residence / Office Location</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address or office door number"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-medium text-slate-900 outline-hidden"
              />
            </div>
          </div>

          {/* Bio / Summary */}
          <div className="text-xs">
            <label className="block font-bold text-slate-700 mb-1.5">Bio & Public Overview</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief summary about yourself or your charity mission in Adama..."
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-medium text-slate-900 outline-hidden resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-sm shadow-emerald-200 transition-all flex items-center gap-2"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Personal Information</span>
            </button>
          </div>
        </form>
      )}

      {/* SUB-TAB 2: ORGANIZATION & OFFICIAL CREDENTIALS */}
      {activeSubTab === 'ORG_INFO' && (
        <form onSubmit={handleSaveProfile} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Organization & Role Credentials ({currentUser.role.replace('_', ' ')})
              </h2>
              <p className="text-xs text-slate-500">
                Specify official organizational records, NGO registration numbers, or municipal credentials
              </p>
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-sm shadow-emerald-200 transition-all flex items-center gap-2"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Credentials</span>
            </button>
          </div>

          {/* DYNAMIC FIELDS FOR DONOR ROLE */}
          {currentUser.role === 'DONOR' && (
            <div className="space-y-5 text-xs">
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                <Building2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-slate-900">Donor Profile & NGO Information</p>
                  <p className="text-[11px] text-slate-600">
                    If donating on behalf of a company, foundation, or diaspora organization, enter registration details for official tax-deductible receipts.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Donor Classification *</label>
                  <select
                    value={donorType}
                    onChange={(e) => setDonorType(e.target.value as any)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-bold text-slate-900 outline-hidden bg-white"
                  >
                    <option value="INDIVIDUAL">Individual Philanthropist</option>
                    <option value="COMPANY">Corporate / Private Enterprise</option>
                    <option value="NGO">Registered NGO / Charity Organization</option>
                    <option value="DIASPORA">Ethiopian Diaspora Association</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Organization / Enterprise Title</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. Adama Commercial Development Association"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-medium text-slate-900 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">NGO / Business Registration Number</label>
                  <input
                    type="text"
                    value={orgRegNumber}
                    onChange={(e) => setOrgRegNumber(e.target.value)}
                    placeholder="e.g. CSO/NGO-2024/9912"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-mono text-slate-900 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Tax Identification Number (TIN)</label>
                  <input
                    type="text"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    placeholder="e.g. TIN-0092182741"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-mono text-slate-900 outline-hidden"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1.5">Official Website / Portal Link</label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://www.yourorganization.org"
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-mono text-slate-900 outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DYNAMIC FIELDS FOR BENEFICIARY ROLE */}
          {currentUser.role === 'BENEFICIARY' && (
            <div className="space-y-5 text-xs">
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                <Users className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-slate-900">Household & Beneficiary Family Records</p>
                  <p className="text-[11px] text-slate-600">
                    This information helps Kebele verification officers assess support request priority and household allocation limits.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Household / Family Members Count *</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={householdSize}
                    onChange={(e) => setHouseholdSize(Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-bold text-slate-900 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Assigned Kebele Verification Officer</label>
                  <input
                    type="text"
                    disabled
                    value="Kebele Social Affairs Desk (Kebele 04)"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-100 font-medium text-slate-600 outline-hidden cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Resident Verification Status</label>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2 text-blue-900 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Kebele Resident Certificate Validated</span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Emergency Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+251 92 000 1122"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-mono text-slate-900 outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* DYNAMIC FIELDS FOR ADMIN ROLES */}
          {(currentUser.role === 'KEBELE_ADMIN' ||
            currentUser.role === 'WOREDA_ADMIN' ||
            currentUser.role === 'CITY_ADMIN' ||
            currentUser.role === 'SYSTEM_ADMIN') && (
            <div className="space-y-5 text-xs">
              <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-start gap-3 border border-slate-800">
                <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-white">Municipal Officer & Administrative Credentials</p>
                  <p className="text-[11px] text-slate-300">
                    Official verification keys assigned by Adama City Municipal Administration for official signing & distribution auditing.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Executive Department / Office</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Social Welfare & Public Assistance Directorate"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-medium text-slate-900 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Official Administrative Staff Badge ID</label>
                  <input
                    type="text"
                    disabled
                    value={`ADM-OFFICER-${currentUser.role.replace('_', '-')}`}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-100 font-mono font-bold text-slate-700 outline-hidden cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Municipal Office Phone Extension</label>
                  <input
                    type="text"
                    placeholder="+251 22 111 8890"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-mono text-slate-900 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Security Clearance Tier</label>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-900 font-extrabold">
                    <span>Level 4 - City Verification Signatory</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-sm shadow-emerald-200 transition-all flex items-center gap-2"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Organization Credentials</span>
            </button>
          </div>
        </form>
      )}

      {/* SUB-TAB 3: SECURITY & PASSWORD */}
      {activeSubTab === 'SECURITY' && (
        <div className="space-y-6">
          {/* Change Password Form */}
          <form onSubmit={handleUpdatePassword} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Security & Password Management</h2>
                <p className="text-xs text-slate-500">Update your account password and manage two-factor authentication</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
              {/* Current Password */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Current Password *</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-mono text-slate-900 outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">New Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-9 pr-9 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-mono text-slate-900 outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Confirm New Password *</label>
                <div className="relative">
                  <CheckCircle2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    className="w-full pl-9 pr-9 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-mono text-slate-900 outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password strength indicator */}
            {newPassword && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-700">
                  <span>Password Strength:</span>
                  <span className={newPassword.length >= 8 ? 'text-emerald-600' : 'text-amber-600'}>
                    {newPassword.length >= 8 ? 'Strong' : 'Moderate'}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      newPassword.length >= 8 ? 'w-full bg-emerald-500' : 'w-1/2 bg-amber-500'
                    }`}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-sm shadow-emerald-200 transition-all flex items-center gap-2"
              >
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                <span>Update Password</span>
              </button>
            </div>
          </form>

          {/* Two-Factor & OAuth Section */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xs">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Multi-Factor Security & Third-Party Sign-In</span>
            </h3>

            <div className="divide-y divide-slate-100 text-xs">
              {/* 2FA Toggle */}
              <div className="py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-extrabold text-slate-900">Two-Factor SMS Verification (2FA)</p>
                  <p className="text-[11px] text-slate-500">
                    Require a single-use passcode sent to {phone} when signing in from unknown devices
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextVal = !twoFactorEnabled;
                    setTwoFactorEnabled(nextVal);
                    updateProfile({ twoFactorEnabled: nextVal });
                    showToast(`2FA Security ${nextVal ? 'Enabled' : 'Disabled'}`);
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    twoFactorEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Google OAuth Connection */}
              <div className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
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
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-900">Google Single Sign-On</p>
                    <p className="text-[11px] text-slate-500">
                      {currentUser.googleConnected
                        ? `Connected with ${currentUser.email}`
                        : 'Link your Google Workspace or Gmail account for fast 1-click access'}
                    </p>
                  </div>
                </div>

                {currentUser.googleConnected ? (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Connected
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      updateProfile({ googleConnected: true });
                      showToast('Google account connected to profile!');
                    }}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[11px] font-bold transition-all"
                  >
                    Link Google Account
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: PREFERENCES */}
      {activeSubTab === 'PREFERENCES' && (
        <form onSubmit={handleSaveProfile} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">System Preferences & Language</h2>
              <p className="text-xs text-slate-500">Configure language options and automated notification preferences</p>
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-sm shadow-emerald-200 transition-all flex items-center gap-2"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Preferences</span>
            </button>
          </div>

          <div className="space-y-6 text-xs">
            {/* Preferred Language */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Preferred Interface Language</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    language === 'en'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <p className="font-extrabold text-slate-900">English (US)</p>
                    <p className="text-[10px] text-slate-500">System Default</p>
                  </div>
                  {language === 'en' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => setLanguage('om')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    language === 'om'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <p className="font-extrabold text-slate-900">Afaan Oromoo</p>
                    <p className="text-[10px] text-slate-500">Afaan Hawaasa Adaamaa</p>
                  </div>
                  {language === 'om' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => setLanguage('am')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    language === 'am'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <p className="font-extrabold text-slate-900">አማርኛ (Amharic)</p>
                    <p className="text-[10px] text-slate-500">የከተማው የመንግስት ቋንቋ</p>
                  </div>
                  {language === 'am' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </button>
              </div>
            </div>

            {/* Notification Toggles */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="font-extrabold text-slate-900">Automated Notification Alerts</h3>

              <div className="divide-y divide-slate-100">
                <div className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">Email Updates & Official Digital Receipts</p>
                    <p className="text-[11px] text-slate-500">
                      Receive transaction receipts, Kebele verification updates, and audit notices
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">SMS Alerts & Emergency Relief Broadcasts</p>
                    <p className="text-[11px] text-slate-500">
                      Receive direct SMS messages regarding distribution schedules or urgent relief allocations
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsNotifications}
                    onChange={(e) => setSmsNotifications(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-sm shadow-emerald-200 transition-all flex items-center gap-2"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save All Preferences</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
