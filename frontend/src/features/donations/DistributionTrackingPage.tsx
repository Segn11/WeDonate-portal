import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ExportModal } from '../../components/common/ExportModal';
import {
  PackageCheck,
  Search,
  Building2,
  CheckCircle2,
  MapPin,
  Download,
  FileCheck2,
  Printer,
  ShieldCheck,
} from 'lucide-react';

export const DistributionTrackingPage: React.FC = () => {
  const { distributions, requests } = useData();
  const [search, setSearch] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);

  const filteredDistributions = distributions.filter(
    (d) =>
      d.beneficiaryName.toLowerCase().includes(search.toLowerCase()) ||
      d.kebele.toLowerCase().includes(search.toLowerCase()) ||
      d.distributionNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.receiptVerificationCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="bg-emerald-500 text-slate-950 font-extrabold text-[10px] px-2.5 py-0.5 rounded uppercase">
            Distribution & Delivery Ledger
          </span>
          <h1 className="text-2xl font-black mt-1 tracking-tight">
            Kebele Beneficiary Delivery Ledger
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Audit-backed record of all verified handovers with digital signatures & receipt codes.
          </p>
        </div>

        <button
          onClick={() => setShowExportModal(true)}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md"
        >
          <Download className="w-4 h-4" />
          <span>Export Ledger</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-5 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="font-bold text-slate-900 text-sm">Completed Beneficiary Handover Log</h3>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by receipt code, name, kebele..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200">
              <tr>
                <th className="p-3">Distribution #</th>
                <th className="p-3">Receipt Code</th>
                <th className="p-3">Beneficiary</th>
                <th className="p-3">Kebele / Woreda</th>
                <th className="p-3">Items / Allocation</th>
                <th className="p-3">Kebele Official</th>
                <th className="p-3">Verification Stamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredDistributions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No distribution records match search criteria.
                  </td>
                </tr>
              ) : (
                filteredDistributions.map((dist) => (
                  <tr key={dist.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-900">{dist.distributionNumber}</td>
                    <td className="p-3 font-mono text-amber-700 font-bold">{dist.receiptVerificationCode}</td>
                    <td className="p-3 font-bold text-slate-900">
                      {dist.beneficiaryName}
                      <span className="block text-[10px] font-mono text-slate-400">{dist.beneficiaryPhone}</span>
                    </td>
                    <td className="p-3 font-medium text-slate-700">{dist.kebele}</td>
                    <td className="p-3 text-emerald-800 font-bold">{dist.itemsOrAmountDistributed}</td>
                    <td className="p-3 text-slate-600">{dist.distributedByKebeleAdmin}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-900 font-bold text-[10px] rounded-full">
                        <ShieldCheck className="w-3 h-3 text-emerald-700" />
                        <span>Fingerprint Signed</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showExportModal && (
        <ExportModal
          title="Adama Distribution Ledger"
          data={distributions}
          filenamePrefix="Adama_Distribution_Ledger"
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
};
