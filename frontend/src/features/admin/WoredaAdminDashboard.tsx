import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { BeneficiaryRequest } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Landmark,
  CheckCircle2,
  XCircle,
  Eye,
  ShieldCheck,
  Building2,
  BarChart3,
  Globe,
} from 'lucide-react';

export const WoredaAdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { requests, updateRequestStatus } = useData();

  const [selectedReq, setSelectedReq] = useState<BeneficiaryRequest | null>(null);
  const [comment, setComment] = useState('');

  const myWoreda = currentUser?.woreda;

  // Requests that passed Kebele review and await Woreda final approval
  const pendingWoredaReview = requests.filter(
    (r) => myWoreda && r.woreda === myWoreda && (r.status === 'APPROVED_BY_KEBELE' || r.status === 'UNDER_WOREDA_REVIEW')
  );

  const publishedInWoreda = requests.filter(
    (r) => myWoreda && r.woreda === myWoreda && (r.status === 'APPROVED_PUBLISHED' || r.status === 'PARTIALLY_FUNDED' || r.status === 'FULLY_FUNDED')
  );

  const handleApproveWoreda = async (reqId: string) => {
    await updateRequestStatus(
      reqId,
      'APPROVED_PUBLISHED',
      currentUser?.fullName || 'Woreda Supervisor',
      comment || 'Woreda supervisor sign-off complete. Approved for live public donation matching.'
    );
    setSelectedReq(null);
    setComment('');
  };

  return (
    <div className="space-y-6">
      {/* Woreda Banner */}
      <div className="bg-emerald-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Decorative blur elements */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-800/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-700/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-800 text-emerald-200 border border-emerald-700 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Sub-City Woreda Supervisor Portal
            </span>
            <span className="text-xs text-emerald-200 font-bold">• {myWoreda}</span>
          </div>
          <h1 className="text-2xl font-black mt-1 tracking-tight">
            Regional Support Approval & Oversight
          </h1>
          <p className="text-xs text-emerald-100/90 mt-0.5">
            Second-tier government approval hierarchy before public campaign publishing.
          </p>
        </div>

        <div className="relative z-10 bg-emerald-800/80 backdrop-blur-xs p-3 rounded-xl border border-emerald-700 text-right">
          <p className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider">Pending Approval Queue</p>
          <p className="text-2xl font-black text-amber-300">{pendingWoredaReview.length} Requests</p>
        </div>
      </div>

      {/* Main Approval Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
        <h3 className="font-bold text-slate-900 text-sm">Kebele-Approved Request Review Queue</h3>

        {pendingWoredaReview.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs bg-slate-50 rounded-xl">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="font-bold text-slate-700 text-sm">Woreda Approval Queue Clear!</p>
            <p className="text-slate-500 mt-0.5">
              All Kebele-verified citizen requests in Bole Sub-City have been processed.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingWoredaReview.map((req) => (
              <div
                key={req.id}
                className="p-4 border border-slate-200 rounded-xl hover:border-amber-400 transition-all bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500">{req.requestNumber}</span>
                    <StatusBadge urgency={req.urgency} size="sm" />
                    <span className="text-[10px] bg-indigo-100 text-indigo-900 font-bold px-2 py-0.5 rounded">
                      Kebele Approved: {req.kebele}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{req.title}</h4>
                  <p className="text-xs text-slate-600">
                    Beneficiary: <strong>{req.beneficiaryName}</strong> • Household: {req.householdSize}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right font-mono pr-2">
                    <p className="text-[10px] text-slate-400 uppercase">Target Need</p>
                    <p className="font-black text-emerald-800 text-base">
                      {req.estimatedAmountNeededEtb.toLocaleString()} ETB
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedReq(req)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5"
                  >
                    <Globe className="w-4 h-4 text-amber-400" />
                    <span>Approve & Publish Live</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Inspector Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">Woreda Regional Approval Sign-off</h3>
              </div>
              <button onClick={() => setSelectedReq(null)} className="p-1 text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">{selectedReq.title}</h4>
                <p className="text-slate-600 leading-relaxed">{selectedReq.description}</p>
                <div className="pt-2 border-t border-slate-200 text-slate-700">
                  <p>Kebele Verification Stamp: <strong>{selectedReq.verificationNotes?.kebeleApprovedBy || 'Kebele Admin'}</strong></p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-900 mb-1">Woreda Supervisor Endorsement Comment</label>
                <textarea
                  rows={2}
                  placeholder="E.g. Reviewed Kebele inspection report. Confirmed regional budget match."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedReq(null)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleApproveWoreda(selectedReq.id)}
                  className="px-6 py-2.5 bg-emerald-600 text-white font-extrabold rounded-xl hover:bg-emerald-500 shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish for Public Donors</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
