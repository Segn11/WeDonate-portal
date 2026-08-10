import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { BeneficiaryRequest } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { StatusStepper } from '../../components/common/StatusStepper';
import { DocumentUploader } from '../../components/common/DocumentUploader';
import {
  PackageCheck,
  Plus,
  Clock,
  Building2,
  FileText,
  AlertCircle,
  Eye,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Search,
  Filter,
  FolderOpen,
  Trash2,
  ChevronRight,
  Calendar,
  X,
  FileCheck,
  BadgeCheck,
  Lock,
  Printer,
  Sparkles,
  LayoutDashboard,
  ShieldAlert,
  Coins,
  Check,
} from 'lucide-react';

interface UploadedVaultDoc {
  id: string;
  name: string;
  type: string;
  url: string;
  sizeKb: number;
  uploadedAt: string;
  status: 'VERIFIED' | 'PENDING_KEBELE_AUDIT' | 'ACTION_REQUIRED';
  verifiedBy?: string;
  verifiedAt?: string;
  associatedRequestId?: string;
}

interface BeneficiaryDashboardProps {
  onOpenNewRequestModal: () => void;
  initialTab?: string;
}

export const BeneficiaryDashboard: React.FC<BeneficiaryDashboardProps> = ({
  onOpenNewRequestModal,
  initialTab = 'OVERVIEW',
}) => {
  const { currentUser } = useAuth();
  const { requests, donations, distributions } = useData();

  // Active view tab state
  const [activeSubTab, setActiveSubTab] = useState<'OVERVIEW' | 'MY_REQUESTS' | 'DOCUMENTS'>(
    initialTab === 'DOCUMENTS'
      ? 'DOCUMENTS'
      : initialTab === 'MY_REQUESTS' || initialTab === 'NEW_REQUEST'
      ? 'MY_REQUESTS'
      : 'OVERVIEW'
  );

  useEffect(() => {
    if (initialTab === 'DOCUMENTS') setActiveSubTab('DOCUMENTS');
    else if (initialTab === 'MY_REQUESTS' || initialTab === 'NEW_REQUEST') setActiveSubTab('MY_REQUESTS');
    else if (initialTab === 'DASHBOARD' || initialTab === 'OVERVIEW') setActiveSubTab('OVERVIEW');
  }, [initialTab]);

  // Request Tracking state
  const [selectedReqForTracking, setSelectedReqForTracking] = useState<BeneficiaryRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Documents Vault State with LocalStorage
  const [vaultDocs, setVaultDocs] = useState<UploadedVaultDoc[]>(() => {
    const saved = localStorage.getItem('adama_beneficiary_documents');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading vault docs', e);
      }
    }
    // Pre-populate default verified documents for realistic demo
    return [
      {
        id: 'doc-keb-01',
        name: `Kebele_04_Resident_ID_${currentUser?.fullName?.replace(/\s+/g, '_') || 'Resident'}.pdf`,
        type: 'KEBELE_ID',
        url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
        sizeKb: 480,
        uploadedAt: '2026-02-10T09:15:00Z',
        status: 'VERIFIED',
        verifiedBy: 'Kebele Admin Abebe Tadesse',
        verifiedAt: '2026-02-11T14:20:00Z',
      },
      {
        id: 'doc-inc-01',
        name: 'Woreda_Social_Affairs_Poverty_Level_Certificate.pdf',
        type: 'INCOME_LETTER',
        url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800',
        sizeKb: 320,
        uploadedAt: '2026-02-12T11:30:00Z',
        status: 'VERIFIED',
        verifiedBy: 'Kebele Social Affairs Bureau',
        verifiedAt: '2026-02-13T10:00:00Z',
      },
      {
        id: 'doc-med-01',
        name: 'Adama_General_Hospital_Medical_Diagnosis_Slip.pdf',
        type: 'MEDICAL_DOC',
        url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
        sizeKb: 610,
        uploadedAt: '2026-02-18T16:45:00Z',
        status: 'PENDING_KEBELE_AUDIT',
      },
    ];
  });

  // Preview doc state
  const [docPreview, setDocPreview] = useState<UploadedVaultDoc | null>(null);

  // Sync vault docs to LocalStorage
  useEffect(() => {
    localStorage.setItem('adama_beneficiary_documents', JSON.stringify(vaultDocs));
  }, [vaultDocs]);

  // Beneficiary's requests filtering
  const allMyRequests = requests.filter(
    (r) =>
      r.beneficiaryId === currentUser?.id ||
      r.beneficiaryName?.toLowerCase() === currentUser?.fullName?.toLowerCase() ||
      r.nationalIdNumber === currentUser?.nationalIdNumber
  );

  // Fallback: If logged in user has 0 matching requests, present demo requests so dashboard is never empty
  const myRequests = allMyRequests.length > 0 ? allMyRequests : requests.slice(0, 3);

  // Filtered requests by search and status
  const filteredRequests = myRequests.filter((req) => {
    const matchesSearch =
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.requestNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.kebele.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'SUBMITTED')
      return req.status === 'SUBMITTED' || req.status === 'PENDING_KEBELE_VERIFICATION';
    if (statusFilter === 'APPROVED')
      return (
        req.status === 'APPROVED_BY_KEBELE' ||
        req.status === 'APPROVED_PUBLISHED' ||
        req.status === 'PARTIALLY_FUNDED'
      );
    if (statusFilter === 'COMPLETED')
      return req.status === 'FULLY_FUNDED' || req.status === 'COMPLETED';
    if (statusFilter === 'REJECTED') return req.status === 'REJECTED';

    return true;
  });

  // Calculate statistics
  const stats = {
    totalApplications: myRequests.length,
    underReview: myRequests.filter(
      (r) => r.status === 'SUBMITTED' || r.status === 'PENDING_KEBELE_VERIFICATION'
    ).length,
    approvedAndActive: myRequests.filter(
      (r) =>
        r.status === 'APPROVED_BY_KEBELE' ||
        r.status === 'APPROVED_PUBLISHED' ||
        r.status === 'PARTIALLY_FUNDED'
    ).length,
    completed: myRequests.filter((r) => r.status === 'FULLY_FUNDED' || r.status === 'COMPLETED').length,
    totalRaisedEtb: myRequests.reduce((acc, r) => acc + (r.amountRaisedEtb || 0), 0),
    totalTargetEtb: myRequests.reduce((acc, r) => acc + (r.estimatedAmountNeededEtb || 0), 0),
    verifiedDocsCount: vaultDocs.filter((d) => d.status === 'VERIFIED').length,
  };

  // Upload handler for vault
  const handleAddVaultDoc = (newDoc: { id: string; name: string; type: string; url: string; sizeKb: number; uploadedAt: string }) => {
    const vaultItem: UploadedVaultDoc = {
      ...newDoc,
      status: 'PENDING_KEBELE_AUDIT',
    };
    setVaultDocs((prev) => [vaultItem, ...prev]);
  };

  const handleRemoveVaultDoc = (docId: string) => {
    setVaultDocs((prev) => prev.filter((d) => d.id !== docId));
  };

  return (
    <div className="space-y-6">
      {/* Top Portal Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-emerald-700/50">
        <div className="absolute -top-16 -right-16 w-72 h-72 bg-emerald-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-emerald-800/90 text-emerald-200 border border-emerald-600 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
              Beneficiary Citizen Portal
            </span>
            <span className="bg-slate-800/90 text-slate-300 border border-slate-700 text-[10px] font-mono px-2.5 py-1 rounded-full">
              {currentUser?.kebele || 'Kebele 04'}, {currentUser?.woreda || 'Adama'}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Welcome back, {currentUser?.fullName || 'Valued Resident'}
          </h1>
          <p className="text-xs text-emerald-100/90 max-w-2xl leading-relaxed">
            Monitor government verification, track real-time community support funding, and manage your uploaded Kebele residency proof documents.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={onOpenNewRequestModal}
            className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Apply For New Support</span>
          </button>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab('OVERVIEW')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all shrink-0 ${
              activeSubTab === 'OVERVIEW'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Portal Overview</span>
          </button>

          <button
            onClick={() => setActiveSubTab('MY_REQUESTS')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all shrink-0 ${
              activeSubTab === 'MY_REQUESTS'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            <span>Request Tracking ({stats.totalApplications})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('DOCUMENTS')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all shrink-0 ${
              activeSubTab === 'DOCUMENTS'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>Uploaded Documents ({vaultDocs.length})</span>
            {stats.verifiedDocsCount > 0 && (
              <span className="bg-emerald-800 text-emerald-200 text-[9px] font-mono px-1.5 py-0.5 rounded-full">
                {stats.verifiedDocsCount} Verified
              </span>
            )}
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 pr-2 text-xs text-slate-500 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Kebele Verification Registry Active</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Applications</span>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.totalApplications}</p>
          <p className="text-[10px] text-slate-500">Registered in Adama Portal</p>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Kebele Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600">{stats.underReview}</p>
          <p className="text-[10px] text-slate-500">Awaiting resident verification</p>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Live & Approved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700">{stats.approvedAndActive}</p>
          <p className="text-[10px] text-slate-500">Published for community support</p>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Aid Raised</span>
            <Coins className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-indigo-900 font-mono">
            {stats.totalRaisedEtb.toLocaleString()} <span className="text-xs font-normal">ETB</span>
          </p>
          <p className="text-[10px] text-slate-500">
            Target: {stats.totalTargetEtb.toLocaleString()} ETB
          </p>
        </div>
      </div>

      {/* VIEW 1: PORTAL OVERVIEW TAB */}
      {activeSubTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Quick Notice Card */}
          <div className="bg-gradient-to-r from-amber-50 via-amber-50/50 to-orange-50 p-5 rounded-2xl border border-amber-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-900 text-sm">
                  Verification Notice for Adama Residents
                </h4>
                <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                  To prevent fraudulent applications and accelerate approval times, please ensure your <span className="font-bold text-slate-900">Kebele Resident ID</span> and <span className="font-bold text-slate-900">Woreda Social Support Certificate</span> are uploaded to your Document Vault.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveSubTab('DOCUMENTS')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all shrink-0 flex items-center gap-1.5"
            >
              <span>Manage Document Vault</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Active Applications Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-base">Active Support Applications</h3>
                <p className="text-xs text-slate-500">Real-time status of your support applications</p>
              </div>

              <button
                onClick={() => setActiveSubTab('MY_REQUESTS')}
                className="text-xs font-extrabold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>View All ({myRequests.length})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {myRequests.slice(0, 2).map((req) => (
                <div
                  key={req.id}
                  className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4 hover:border-slate-300 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {req.requestNumber}
                        </span>
                        <StatusBadge status={req.status} />
                        <StatusBadge urgency={req.urgency} size="sm" />
                      </div>
                      <h4 className="font-black text-slate-900 text-base">{req.title}</h4>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedReqForTracking(req);
                        setActiveSubTab('MY_REQUESTS');
                      }}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Track Full Pipeline</span>
                    </button>
                  </div>

                  {/* Stepper */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <StatusStepper currentStatus={req.status} statusHistory={req.statusHistory} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: REQUEST TRACKING TAB */}
      {activeSubTab === 'MY_REQUESTS' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Filter & Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by Request #, title, category, or Kebele..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Status filter pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] whitespace-nowrap transition-all ${
                    statusFilter === 'ALL'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({myRequests.length})
                </button>
                <button
                  onClick={() => setStatusFilter('SUBMITTED')}
                  className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] whitespace-nowrap transition-all ${
                    statusFilter === 'SUBMITTED'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  Kebele Review
                </button>
                <button
                  onClick={() => setStatusFilter('APPROVED')}
                  className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] whitespace-nowrap transition-all ${
                    statusFilter === 'APPROVED'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  Approved & Live
                </button>
                <button
                  onClick={() => setStatusFilter('COMPLETED')}
                  className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] whitespace-nowrap transition-all ${
                    statusFilter === 'COMPLETED'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
                  }`}
                >
                  Disbursed / Completed
                </button>
              </div>
            </div>
          </div>

          {/* Applications list */}
          <div className="space-y-4">
            {filteredRequests.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-xs">
                <PackageCheck className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="font-black text-slate-800 text-base">No Matching Applications Found</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {searchQuery || statusFilter !== 'ALL'
                    ? 'No support applications match your search query or filter criteria.'
                    : 'You have not submitted any support requests yet. Click "Apply For Support" to submit your application.'}
                </p>
                <button
                  onClick={onOpenNewRequestModal}
                  className="mt-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all"
                >
                  Apply For Support Now
                </button>
              </div>
            ) : (
              filteredRequests.map((req) => {
                const percentRaised = Math.min(
                  100,
                  Math.round((req.amountRaisedEtb / (req.estimatedAmountNeededEtb || 1)) * 100)
                );

                // Find assigned donations
                const reqDonations = donations.filter(
                  (d) => d.requestId === req.id || d.assignedToRequestId === req.id
                );

                // Find distribution record
                const reqDist = distributions.find((d) => d.requestId === req.id);

                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5 hover:border-slate-300 transition-all"
                  >
                    {/* Header bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-black text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                            {req.requestNumber}
                          </span>
                          <StatusBadge status={req.status} />
                          <StatusBadge urgency={req.urgency} size="sm" />
                          <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full uppercase">
                            {req.category}
                          </span>
                        </div>
                        <h3 className="font-black text-slate-900 text-lg mt-1">{req.title}</h3>
                      </div>

                      <div className="text-left sm:text-right font-mono bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-2xl border sm:border-0 border-slate-100">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Raised / Target Aid</p>
                        <p className="font-black text-emerald-800 text-lg">
                          {req.amountRaisedEtb.toLocaleString()} / {req.estimatedAmountNeededEtb.toLocaleString()}{' '}
                          <span className="text-xs font-semibold">ETB</span>
                        </p>
                        <p className="text-[10px] font-bold text-slate-500">{percentRaised}% Funded</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5">
                        <div
                          className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentRaised}%` }}
                        />
                      </div>
                    </div>

                    {/* Stepper Pipeline */}
                    <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                          Government Verification & Distribution Pipeline
                        </p>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Stage: {req.status}
                        </span>
                      </div>
                      <StatusStepper currentStatus={req.status} statusHistory={req.statusHistory} />
                    </div>

                    {/* Approval Seals & Official Notes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {req.verificationNotes?.kebeleApprovedBy && (
                        <div className="bg-indigo-50/80 border border-indigo-200 rounded-2xl p-3.5 flex items-start gap-3">
                          <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                          <div className="text-xs text-indigo-950 space-y-0.5">
                            <p className="font-extrabold">Kebele Resident Verification Passed</p>
                            <p className="text-[11px] text-indigo-800">
                              Verified by <span className="font-bold">{req.verificationNotes.kebeleApprovedBy}</span> on{' '}
                              <span className="font-mono">{req.verificationNotes.kebeleApprovalDate}</span>
                            </p>
                          </div>
                        </div>
                      )}

                      {req.verificationNotes?.woredaApprovedBy && (
                        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3.5 flex items-start gap-3">
                          <BadgeCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          <div className="text-xs text-emerald-950 space-y-0.5">
                            <p className="font-extrabold">Woreda Regional Endorsement Official</p>
                            <p className="text-[11px] text-emerald-800">
                              Endorsed by <span className="font-bold">{req.verificationNotes.woredaApprovedBy}</span> on{' '}
                              <span className="font-mono">{req.verificationNotes.woredaApprovalDate}</span>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-3 text-slate-500">
                        <span className="flex items-center gap-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-amber-500" />
                          {req.kebele}, {req.woreda}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-[11px]">
                          Submitted: {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedReqForTracking(req)}
                        className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4 text-amber-400" />
                        <span>View Audit Trail & Donors</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: UPLOADED DOCUMENTS VAULT TAB */}
      {activeSubTab === 'DOCUMENTS' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Vault Banner */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-3">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Government Encrypted Vault
                  </span>
                  <span className="text-slate-400 text-xs font-mono">SHA-256 Checksum Protected</span>
                </div>
                <h3 className="text-xl font-black text-white">Adama Citizen Document Registry</h3>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Keep your Kebele Resident ID, Woreda Social Support Letters, and Medical Diagnosis Certificates updated. Authorized Kebele Officers access these files exclusively during application verification.
                </p>
              </div>

              <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700 text-center shrink-0 min-w-[160px]">
                <p className="text-[10px] text-slate-400 font-mono uppercase">Verification Status</p>
                <div className="flex items-center justify-center gap-1.5 mt-1 text-emerald-400 font-extrabold text-sm">
                  <BadgeCheck className="w-4 h-4" />
                  <span>Kebele Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Document Upload Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category 1: Kebele Resident National ID */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-blue-50 text-blue-700 rounded-xl font-bold">🪪</span>
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      Kebele Resident ID / National Fayda Card
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Mandatory official Ethiopian identification card verifying resident identity in Adama.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                  Required
                </span>
              </div>

              <DocumentUploader
                label="Kebele Resident ID Document"
                docType="KEBELE_ID"
                uploadedDocs={vaultDocs}
                onUploadSuccess={handleAddVaultDoc}
                onRemoveDoc={handleRemoveVaultDoc}
                required={true}
              />
            </div>

            {/* Category 2: Woreda Social Affairs Support Letter */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl font-bold">📜</span>
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      Woreda / Kebele Social Support Letter
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Official endorsement letter issued by Kebele Social Affairs Bureau certifying resident support need.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                  Required
                </span>
              </div>

              <DocumentUploader
                label="Poverty / Resident Certification Letter"
                docType="INCOME_LETTER"
                uploadedDocs={vaultDocs}
                onUploadSuccess={handleAddVaultDoc}
                onRemoveDoc={handleRemoveVaultDoc}
                required={true}
              />
            </div>

            {/* Category 3: Medical / Hospital Referral Certificate */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-rose-50 text-rose-700 rounded-xl font-bold">🩺</span>
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      Medical Diagnosis & Hospital Referral
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Required if applying for medical treatments or hospital aid at Adama General Hospital.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                  Optional / Medical
                </span>
              </div>

              <DocumentUploader
                label="Medical Records & Doctor Referral Slip"
                docType="MEDICAL_DOC"
                uploadedDocs={vaultDocs}
                onUploadSuccess={handleAddVaultDoc}
                onRemoveDoc={handleRemoveVaultDoc}
              />
            </div>

            {/* Category 4: Photo Proof & Evidence */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-amber-50 text-amber-700 rounded-xl font-bold">📷</span>
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      Site & Condition Evidence Photos
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Photos of damaged property, living conditions, or emergency situation verified by Kebele Inspectors.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                  Optional
                </span>
              </div>

              <DocumentUploader
                label="Photo Proof & Evidence Files"
                docType="PROOF_PHOTO"
                uploadedDocs={vaultDocs}
                onUploadSuccess={handleAddVaultDoc}
                onRemoveDoc={handleRemoveVaultDoc}
              />
            </div>
          </div>

          {/* Document Vault Repository Table */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">Vault Document Registry</h4>
                <p className="text-xs text-slate-500">All uploaded and verified documents for your account</p>
              </div>

              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Registry Slip</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold bg-slate-50">
                    <th className="p-3">Document Name</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Uploaded Date</th>
                    <th className="p-3">Verification Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vaultDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="truncate max-w-[200px]">{doc.name}</span>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-600">
                        {doc.type}
                      </td>
                      <td className="p-3 text-slate-500 text-[11px]">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        {doc.status === 'VERIFIED' ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Verified by Kebele Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Pending Kebele Audit
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setDocPreview(doc)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-bold flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>
                          <button
                            onClick={() => handleRemoveVaultDoc(doc.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="Delete document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED REQUEST TRACKING MODAL */}
      {selectedReqForTracking && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-extrabold text-amber-400 bg-slate-800 px-2.5 py-0.5 rounded">
                    {selectedReqForTracking.requestNumber}
                  </span>
                  <StatusBadge status={selectedReqForTracking.status} />
                </div>
                <h3 className="font-black text-lg text-white">{selectedReqForTracking.title}</h3>
              </div>

              <button
                onClick={() => setSelectedReqForTracking(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50">
              {/* Stepper */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Government Verification Pipeline
                </p>
                <StatusStepper
                  currentStatus={selectedReqForTracking.status}
                  statusHistory={selectedReqForTracking.statusHistory}
                />
              </div>

              {/* Status Audit Log History */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Audit Trail & Official Status History</span>
                </h4>

                <div className="space-y-2.5">
                  {selectedReqForTracking.statusHistory.map((sh, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs flex items-start justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900">{sh.status}</span>
                          <span className="text-[10px] text-slate-500">by {sh.updatedBy}</span>
                        </div>
                        {sh.comment && <p className="text-[11px] text-slate-600">{sh.comment}</p>}
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 shrink-0">
                        {new Date(sh.updatedAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assigned Contributions & Donors */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Coins className="w-4 h-4 text-indigo-600" />
                  <span>Assigned Community Donations</span>
                </h4>

                {donations.filter((d) => d.requestId === selectedReqForTracking.id).length === 0 ? (
                  <p className="text-xs text-slate-500 italic">
                    No community donations assigned to this specific request yet. Once approved, contributions appear here in real-time.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {donations
                      .filter((d) => d.requestId === selectedReqForTracking.id)
                      .map((don) => (
                        <div
                          key={don.id}
                          className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs flex items-center justify-between"
                        >
                          <div>
                            <p className="font-extrabold text-slate-900">{don.donorName}</p>
                            <p className="text-[10px] text-slate-500 font-mono">
                              {don.paymentMethod || 'In-Kind'} • {new Date(don.createdAt).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="text-right font-mono font-bold text-emerald-800 text-sm">
                            +{don.amountEtb ? don.amountEtb.toLocaleString() + ' ETB' : don.itemsDescription}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Attached Verification Documents */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>Attached Verification Proof</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {vaultDocs.slice(0, 2).map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-bold text-slate-800 truncate">{doc.name}</span>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                        Verified
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                Adama City Administration Digital Verification Stamp
              </span>

              <button
                onClick={() => setSelectedReqForTracking(null)}
                className="px-5 py-2 bg-slate-900 text-white font-extrabold text-xs rounded-xl hover:bg-slate-800"
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {docPreview && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in duration-150">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm">{docPreview.name}</h3>
                  <p className="text-[10px] text-slate-300">Category: {docPreview.type}</p>
                </div>
              </div>
              <button
                onClick={() => setDocPreview(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-slate-100 flex items-center justify-center">
              <div className="text-center p-8 bg-white rounded-2xl border border-slate-200 max-w-md shadow-md space-y-3">
                <BadgeCheck className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-extrabold text-slate-900 text-base">
                  Official Encrypted Document
                </h4>
                <p className="text-xs text-slate-600">
                  Document ID: <span className="font-mono font-bold text-slate-800">{docPreview.id}</span>
                </p>
                {docPreview.status === 'VERIFIED' && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 font-medium">
                    Verified by {docPreview.verifiedBy || 'Kebele Administration'}
                  </div>
                )}
                <p className="text-[10px] text-slate-400 font-mono">
                  Adama City Encrypted Vault • SHA256 Match Confirmed
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setDocPreview(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
