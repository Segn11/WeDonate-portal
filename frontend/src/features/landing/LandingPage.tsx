import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { AdamaLogo } from '../../components/common/AdamaLogo';
import { StatusBadge } from '../../components/common/StatusBadge';
import { TransparencyPortal } from '../transparency/TransparencyPortal';
import { BeneficiaryRequest } from '../../types';
import {
  HeartHandshake,
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  MapPin,
  Sparkles,
  Search,
  ChevronRight,
  FileText,
  UserCheck,
  Award,
  Phone,
  Mail,
  Lock,
  Globe,
  Plus,
  LogIn,
} from 'lucide-react';

interface LandingPageProps {
  onOpenDonateModal: () => void;
  onSelectRequestForDonation: (req: BeneficiaryRequest) => void;
  onOpenNewRequestModal: () => void;
  onOpenLoginModal: (roleHint?: string) => void;
  onOpenRegisterModal: () => void;
  onNavigateToBrowse: () => void;
  hideHeader?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenDonateModal,
  onSelectRequestForDonation,
  onOpenNewRequestModal,
  onOpenLoginModal,
  onOpenRegisterModal,
  onNavigateToBrowse,
  hideHeader = false,
}) => {
  const { currentUser } = useAuth();
  const { requests } = useData();

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  // Filter approved and published requests for the public showcase
  const activePublishedRequests = requests.filter(
    (r) =>
      ['APPROVED_PUBLISHED', 'PARTIALLY_FUNDED', 'IN_DISTRIBUTION'].includes(r.status) &&
      (selectedCategoryFilter === 'ALL' || r.category === selectedCategoryFilter)
  );

  // Filter critical urgency requests for emergency section with fallback
  let criticalRequests = requests.filter(
    (r) =>
      r.urgency === 'CRITICAL' &&
      ['APPROVED_PUBLISHED', 'PARTIALLY_FUNDED'].includes(r.status)
  );

  // Fallback: If fewer than 3 explicit CRITICAL requests, include HIGH urgency or top active requests
  if (criticalRequests.length < 3) {
    const secondary = requests.filter(
      (r) =>
        ['APPROVED_PUBLISHED', 'PARTIALLY_FUNDED'].includes(r.status) &&
        !criticalRequests.some((c) => c.id === r.id)
    );
    criticalRequests = [...criticalRequests, ...secondary].slice(0, 3);
  }

  // Stats calculation
  const totalRaisedEtb = requests.reduce((acc, r) => acc + (r.amountRaisedEtb || 0), 0) + 1450000;
  const totalBeneficiaries = requests.length * 4 + 4280;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      {/* 1. Public Header Bar */}
      {!hideHeader && (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AdamaLogo
                size="md"
                lightText={false}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                title="Adama Support Portal - Scroll to Top"
              />
            </div>

            <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
              <a href="#how-it-works" className="hover:text-emerald-700 transition-colors">
                How It Works
              </a>
              <a href="#active-causes" className="hover:text-emerald-700 transition-colors">
                Verified Causes
              </a>
              <a href="#transparency" className="hover:text-emerald-700 transition-colors">
                Transparency
              </a>
              <a href="#portals" className="hover:text-emerald-700 transition-colors">
                Municipal Portals
              </a>
            </nav>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onOpenLoginModal()}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition-all border border-slate-200 flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-500" />
                <span>{currentUser ? 'My Portal Dashboard' : 'Log In'}</span>
              </button>

              <button
                onClick={onOpenDonateModal}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm shadow-emerald-200 flex items-center gap-1.5"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Donate Now</span>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* 2. Hero Section */}
      <section className="relative bg-emerald-950 text-white pt-16 pb-24 overflow-hidden">
        {/* Ambient Blur Graphics */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-700/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-900/80 border border-emerald-700/80 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Official Municipal Portal • Adama City Administration</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Digitizing Compassion & <br className="hidden sm:inline" />
                <span className="text-amber-400">Transparent Support</span> in Adama
              </h1>

              <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Replacing manual paper requests with a secure 3-tier government verification system (Kebele → Woreda → Direct Delivery). Every donation is audit-tracked with digital receipt confirmation.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={onOpenDonateModal}
                  className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>Donate to Verified Cause</span>
                </button>

                <button
                  onClick={onOpenNewRequestModal}
                  className="px-5 py-3.5 bg-emerald-800 hover:bg-emerald-700 text-white border border-emerald-600/80 font-bold text-sm rounded-xl transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-emerald-300" />
                  <span>Apply for Support</span>
                </button>


              </div>
            </div>

            {/* Hero Right Visual Card */}
            <div className="lg:col-span-5">
              <div className="bg-white text-slate-900 rounded-3xl p-6 shadow-2xl border border-emerald-800/40 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h3 className="font-extrabold text-sm text-slate-900">Live Support Overview</h3>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full uppercase">
                    Adama City Realtime
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        Total Funds Mobilized
                      </p>
                      <p className="text-2xl font-black text-emerald-700 mt-0.5">
                        ETB {totalRaisedEtb.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Citizens Assisted</p>
                      <p className="text-lg font-extrabold text-slate-900">{totalBeneficiaries.toLocaleString()}+</p>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Active Kebeles</p>
                      <p className="text-lg font-extrabold text-slate-900">15 Kebeles</p>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>100% verified through Kebele resident IDs & Woreda supervisors.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Critical Support Needs Section */}
      {criticalRequests.length > 0 && (
        <section className="bg-rose-50 border-y border-rose-200 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center animate-pulse">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-rose-900 tracking-tight">
                    Critical Support Needs
                  </h2>
                  <p className="text-xs text-rose-700 font-medium">
                    Urgent cases requiring immediate assistance
                  </p>
                </div>
              </div>
              <span className="text-xs bg-rose-100 text-rose-800 font-bold px-3 py-1 rounded-full border border-rose-300">
                {criticalRequests.length} Emergency Cases
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {criticalRequests.map((req) => {
                const pct = Math.min(
                  100,
                  Math.round(((req.amountRaisedEtb || 0) / (req.estimatedAmountNeededEtb || 1)) * 100)
                );

                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl border-2 border-rose-300 shadow-md p-5 space-y-4 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 bg-rose-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-xl">
                      URGENT
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1">{req.title}</h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {req.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-rose-600" />
                        <span className="font-medium">{req.kebele}, {req.woreda}</span>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-rose-700">
                            ETB {(req.amountRaisedEtb || 0).toLocaleString()} raised
                          </span>
                          <span className="text-slate-500">
                            Goal: ETB {req.estimatedAmountNeededEtb.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-rose-600 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectRequestForDonation(req)}
                      className="w-full px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm shadow-rose-200 flex items-center justify-center gap-2"
                    >
                      <HeartHandshake className="w-4 h-4" />
                      <span>Donate Now</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4. Impact Metric Counter Bar */}
      <section className="bg-white border-y border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-slate-900">1.45M+ ETB</p>
              <p className="text-xs text-slate-500 font-medium">Direct Financial & Item Aid</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-emerald-700">100% Verified</p>
              <p className="text-xs text-slate-500 font-medium">Government ID Poverty Audit</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-slate-900">15 Kebeles</p>
              <p className="text-xs text-slate-500 font-medium">Adama Municipal Coverage</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-amber-600">Digital Receipts</p>
              <p className="text-xs text-slate-500 font-medium">Downloadable Verification Code</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works Pipeline */}
      <section id="how-it-works" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            Transparent Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            How The 3-Tier Municipal Verification Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Ensuring every Birr and physical aid item reaches verified residents in real need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-lg flex items-center justify-center">
              01
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Kebele Resident Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Citizens submit support requests with National/Kebele IDs. Local Kebele administrators physically verify household income and flag duplicates.
            </p>
            <div className="pt-2 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Resident ID & Income Assessment</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 font-black text-lg flex items-center justify-center">
              02
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Woreda Regional Endorsement</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sub-city Woreda supervisors conduct second-tier audit checks to approve campaign publishing, ensuring regional balance across Adama.
            </p>
            <div className="pt-2 text-[11px] font-bold text-amber-700 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>Woreda Approval & Campaign Release</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 font-black text-lg flex items-center justify-center">
              03
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Direct Delivery & Digital Receipt</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Donations are assigned directly to approved requests. Distribution is logged with delivery photos, beneficiary signature, and instant digital receipt.
            </p>
            <div className="pt-2 text-[11px] font-bold text-indigo-700 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              <span>Verified Photo & Digital Code</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Active Verified Causes Section */}
      <section id="active-causes" className="bg-slate-100/80 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                Active Campaigns
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
                Verified Resident Support Requests
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Browse official campaigns vetted by Kebele 05, Kebele 02, and Woreda supervisors.
              </p>
            </div>

            <button
              onClick={onNavigateToBrowse}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-1.5"
            >
              <span>View All Requests Catalog</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
            </button>
          </div>

          {/* Requests Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activePublishedRequests.slice(0, 6).map((req) => {
              const pct = Math.min(
                100,
                Math.round(((req.amountRaisedEtb || 0) / (req.estimatedAmountNeededEtb || 1)) * 100)
              );

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-5 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <StatusBadge status={req.status} />
                      <span className="text-[11px] font-bold text-slate-500 font-mono">
                        {req.kebele}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 line-clamp-1">{req.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {req.description}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-emerald-700">
                          ETB {(req.amountRaisedEtb || 0).toLocaleString()} raised
                        </span>
                        <span className="text-slate-500">
                          Goal: ETB {req.estimatedAmountNeededEtb.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="text-[11px] text-slate-500">
                      Beneficiary: <span className="font-bold text-slate-800">{req.beneficiaryName}</span>
                    </div>

                    <button
                      onClick={() => onSelectRequestForDonation(req)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-2xs flex items-center gap-1 shrink-0"
                    >
                      <HeartHandshake className="w-3.5 h-3.5" />
                      <span>Donate</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6.5 Municipal Transparency & Verification Section */}
      <section id="transparency" className="py-16 bg-slate-100/50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TransparencyPortal
            onSelectRequest={onSelectRequestForDonation}
            onOpenDonate={onOpenDonateModal}
          />
        </div>
      </section>

      {/* 7. User Roles & Access Section */}
      <section id="portals" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            Role-Based Access
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Tailored Portals for Every Community Partner
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Donors (Individual, NGO, Corporate, Diaspora) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 hover:border-emerald-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <h3 className="font-bold text-sm text-slate-900">Donor Contributor Portal</h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Individual & NGO
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Unified portal for Individuals, Diaspora, Companies, and NGO Partners. Donate via Telebirr/CBE and track verified impact receipts.
              </p>
            </div>
            <button
              onClick={() => onOpenLoginModal('DONOR')}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 pt-2"
            >
              <span>Donor Login →</span>
            </button>
          </div>

          {/* Beneficiary Households */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 hover:border-amber-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Beneficiary / Citizen</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Submit support applications with Kebele ID and documents. Track review status step-by-step.
              </p>
            </div>
            <button
              onClick={onOpenNewRequestModal}
              className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1 pt-2"
            >
              <span>Apply For Assistance →</span>
            </button>
          </div>
        </div>
      </section>

      {/* 8. Municipal Transparency Footer Banner */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <AdamaLogo
                size="md"
                lightText={true}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                title="Adama Support Portal - Return to Top"
              />
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Official Charity & Community Support Management System of Adama City Administration.
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-white text-xs uppercase tracking-wider">Public Navigation</p>
              <ul className="space-y-1.5 text-[11px]">
                <li><a href="#how-it-works" className="hover:text-white">How Verification Works</a></li>
                <li><a href="#active-causes" className="hover:text-white">Browse Active Causes</a></li>
                <li><button onClick={onOpenDonateModal} className="hover:text-white text-left">Make Direct Donation</button></li>
                <li><button onClick={onOpenNewRequestModal} className="hover:text-white text-left">Citizen Support Request</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-white text-xs uppercase tracking-wider">Government Portals</p>
              <ul className="space-y-1.5 text-[11px]">
                <li><button onClick={() => onOpenLoginModal('KEBELE_ADMIN')} className="hover:text-white">Kebele Resident Verification</button></li>
                <li><button onClick={() => onOpenLoginModal('WOREDA_ADMIN')} className="hover:text-white">Woreda Regional Approval</button></li>
                <li><button onClick={() => onOpenLoginModal('CITY_ADMIN')} className="hover:text-white">Executive City Administration</button></li>
                <li><button onClick={() => onOpenLoginModal('SYSTEM_ADMIN')} className="hover:text-white">System IT Security</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-white text-xs uppercase tracking-wider">Adama City Contact</p>
              <p className="text-[11px]">Adama Mayor Cabinet Office, Bole Road</p>
              <p className="text-[11px] font-mono">+251 22 111 0000 / +251 22 112 0011</p>
              <p className="text-[11px] font-mono">support@adama.gov.et</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px]">
            <p>© 2026 Adama City Administration. All Rights Reserved. Digitized Charity Management Portal.</p>
            <div className="flex items-center gap-4">
              <span>Kebele Security Compliance</span>
              <span>•</span>
              <span>Telebirr & CBE Escrow Integration</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
