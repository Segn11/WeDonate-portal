import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { BeneficiaryRequest, SupportCategory, UrgencyLevel } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ADAMA_KEBELES } from '../../data/mockData';
import { Search, Filter, MapPin, Heart, FileText, ShieldCheck, ArrowRight } from 'lucide-react';

interface BrowseRequestsPageProps {
  onSelectRequestForDonation: (req: BeneficiaryRequest) => void;
  onViewRequestDetails: (req: BeneficiaryRequest) => void;
}

export const BrowseRequestsPage: React.FC<BrowseRequestsPageProps> = ({
  onSelectRequestForDonation,
  onViewRequestDetails,
}) => {
  const { requests, requestsLoading, requestsError } = useData();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedKebele, setSelectedKebele] = useState<string>('ALL');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('ALL');

  // Filter published & verified requests
  const publishedRequests = requests.filter(
    (r) =>
      r.status === 'APPROVED_PUBLISHED' ||
      r.status === 'PARTIALLY_FUNDED' ||
      r.status === 'FULLY_FUNDED'
  );

  const filtered = publishedRequests.filter((req) => {
    const matchesSearch =
      req.title.toLowerCase().includes(search.toLowerCase()) ||
      req.description.toLowerCase().includes(search.toLowerCase()) ||
      req.beneficiaryName.toLowerCase().includes(search.toLowerCase()) ||
      req.requestNumber.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || req.category === selectedCategory;
    const matchesKebele = selectedKebele === 'ALL' || req.kebele.includes(selectedKebele);
    const matchesUrgency = selectedUrgency === 'ALL' || req.urgency === selectedUrgency;

    return matchesSearch && matchesCategory && matchesKebele && matchesUrgency;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          {requestsLoading && (
            <div className="flex items-center gap-2 text-amber-400 text-xs">
              <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <span>Loading support requests...</span>
            </div>
          )}
          {requestsError && (
            <div className="text-rose-400 text-xs font-semibold">
              {requestsError}
            </div>
          )}
          {!requestsLoading && !requestsError && (
            <>
              <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] px-2.5 py-0.5 rounded uppercase tracking-wider">
                Verified Adama Citizens Support Catalog
              </span>
              <h1 className="text-2xl font-black mt-2 tracking-tight">
                Direct Transparent Community Support
              </h1>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Every request listed here has undergone two-tier government verification (Kebele Resident Verification & Woreda Approval).
              </p>
            </>
          )}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by title, beneficiary name, request #, or kebele..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
          </div>

          {/* Kebele Filter */}
          <div className="w-full md:w-56">
            <select
              value={selectedKebele}
              onChange={(e) => setSelectedKebele(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
            >
              <option value="ALL">All Kebeles (Adama)</option>
              {ADAMA_KEBELES.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          {/* Urgency Filter */}
          <div className="w-full md:w-44">
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
            >
              <option value="ALL">All Urgency Levels</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium</option>
            </select>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Category:
          </span>
          {[
            { id: 'ALL', label: 'All Categories' },
            { id: 'FOOD_SUPPLIES', label: 'Food & Rations' },
            { id: 'MEDICAL_HEALTH', label: 'Medical & Health' },
            { id: 'EDUCATION_SCHOOLING', label: 'Education' },
            { id: 'HOUSING_SHELTER', label: 'Housing' },
            { id: 'DISABILITY_ASSISTANCE', label: 'Disability' },
            { id: 'EMERGENCY_RELIEF', label: 'Emergency' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg shrink-0 transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-extrabold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Grid */}
      {filtered.length === 0 && !requestsLoading ? (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-semibold">No support requests match your filters</p>
          <p className="text-slate-400 text-xs mt-1">Try adjusting your search or filter criteria</p>
        </div>
      ) : requestsLoading ? (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-emerald-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-semibold">Loading requests...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((req) => {
            const percent = Math.min(
              100,
              Math.round((req.amountRaisedEtb / (req.estimatedAmountNeededEtb || 1)) * 100)
            );

            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group"
              >
                {/* Top Badge Bar */}
                <div className="p-4 pb-3 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
                  <StatusBadge urgency={req.urgency} size="sm" />
                  <span className="text-[10px] font-mono font-bold text-slate-500">
                    {req.requestNumber}
                  </span>
                </div>

                {/* Card Main Body */}
                <div className="p-4 flex-1 space-y-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span>{req.kebele}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-amber-600 transition-colors">
                    {req.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {req.description}
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Verified: {req.beneficiaryName} ({req.householdSize} Members)</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1 pt-2">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="font-bold text-emerald-800">
                        {req.amountRaisedEtb.toLocaleString()} ETB
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Target: {req.estimatedAmountNeededEtb.toLocaleString()} ETB ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onViewRequestDetails(req)}
                    className="flex-1 py-1.5 px-3 bg-white border border-slate-200 text-slate-800 font-bold text-xs rounded-lg hover:bg-slate-100 text-center transition-colors"
                  >
                    Details & Docs
                  </button>
                  <button
                    onClick={() => onSelectRequestForDonation(req)}
                    disabled={req.status === 'FULLY_FUNDED'}
                    className="flex-1 py-1.5 px-3 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-200 disabled:text-slate-500 text-slate-950 font-extrabold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm"
                  >
                    <span>{req.status === 'FULLY_FUNDED' ? 'Fully Funded' : 'Donate Now'}</span>
                    {req.status !== 'FULLY_FUNDED' && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
