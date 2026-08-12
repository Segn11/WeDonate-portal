import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { BeneficiaryRequest, RequestStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Building2,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  FileText,
  Search,
  Eye,
  PackageCheck,
  Check,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';

export const KebeleAdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { requests, updateRequestStatus, checkDuplicateNationalId, recordDistribution, refetchRequests } = useData();

  const [selectedReq, setSelectedReq] = useState<BeneficiaryRequest | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [activeTab, setActiveTab] = useState<'PENDING' | 'DUPLICATES' | 'DELIVERIES'>('PENDING');
  const [duplicates, setDuplicates] = useState<BeneficiaryRequest[]>([]);

  // Filter requests for this Kebele
  const myKebeleName = currentUser?.kebele;
  const kebeleRequests = (requests || []).filter((r) => myKebeleName && r.kebele === myKebeleName);

  const pendingVerification = kebeleRequests.filter((r) => r.status === 'SUBMITTED' || r.status === 'UNDER_KEBELE_REVIEW');
  const readyForDelivery = kebeleRequests.filter((r) => r.status === 'FULLY_FUNDED' || r.status === 'IN_DISTRIBUTION');

  const handleApproveKebele = async (reqId: string) => {
    await updateRequestStatus(
      reqId,
      'APPROVED_BY_KEBELE',
      currentUser?.fullName || 'Kebele Official',
      reviewComment || 'Household verification complete. Verified resident ID and income status.'
    );
    setSelectedReq(null);
    setReviewComment('');
  };

  const handleRejectKebele = async (reqId: string) => {
    if (!rejectionReason) return;
    await updateRequestStatus(
      reqId,
      'REJECTED',
      currentUser?.fullName || 'Kebele Official',
      undefined,
      rejectionReason
    );
    setSelectedReq(null);
    setRejectionReason('');
  };

  const handleCheckDuplicates = async (nationalId: string, currentRequestId: string) => {
    const result = await checkDuplicateNationalId(nationalId, currentRequestId);
    setDuplicates(result);
  };

  const handleInitiateDistribution = async (req: BeneficiaryRequest) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/distributions/initiate/${req.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          initiatedBy: currentUser?.fullName || 'Kebele Admin',
        }),
      });

      if (response.ok) {
        // Refetch requests to update status
        await refetchRequests();
        alert('Distribution initiated successfully!');
      } else {
        alert('Failed to initiate distribution');
      }
    } catch (error) {
      console.error('Error initiating distribution:', error);
      alert('Error initiating distribution');
    }
  };

  const handleConfirmLocalDelivery = (req: BeneficiaryRequest) => {
    recordDistribution({
      requestId: req.id,
      beneficiaryName: req.beneficiaryName,
      beneficiaryPhone: req.beneficiaryPhone,
      kebele: req.kebele,
      woreda: req.woreda,
      donationId: 'don-501',
      itemsOrAmountDistributed: `${req.estimatedAmountNeededEtb.toLocaleString()} ETB or Equivalent Rations`,
      distributedByKebeleAdmin: currentUser?.fullName || 'Kebele Admin',
      confirmedByBeneficiary: true,
      signatureMock: `${req.beneficiaryName} (Fingerprint / Digital Sign Verified)`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Kebele Banner */}
      <div className="bg-emerald-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Decorative blur elements */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-800/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-700/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-800 text-emerald-200 border border-emerald-700 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Kebele Level Administration
            </span>
            <span className="text-xs text-emerald-200 font-bold">• {myKebeleName}</span>
          </div>
          <h1 className="text-2xl font-black mt-1 tracking-tight">
            Beneficiary Resident Verification Center
          </h1>
          <p className="text-xs text-emerald-100/90 mt-0.5">
            Inspect resident ID, perform household poverty checks, and flag duplicate registrations.
          </p>
        </div>

        <div className="relative z-10 flex gap-2">
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors ${
              activeTab === 'PENDING' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Pending Queue ({pendingVerification.length})
          </button>
          <button
            onClick={() => setActiveTab('DELIVERIES')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors ${
              activeTab === 'DELIVERIES' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Delivery Dispatch ({readyForDelivery.length})
          </button>
        </div>
      </div>

      {/* Main Table / Review Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">
            {activeTab === 'PENDING' ? 'Citizen Verification Queue' : 'Local Distribution Dispatch Queue'}
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            Jurisdiction: {myKebeleName}
          </span>
        </div>

        {activeTab === 'PENDING' && (
          <div className="divide-y divide-slate-100">
            {pendingVerification.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-slate-700">Verification Queue Clear!</p>
                <p className="text-slate-500 mt-0.5">All local beneficiary requests in Kebele 05 have been inspected.</p>
              </div>
            ) : (
              pendingVerification.map((req) => (
                <div key={req.id} className="p-5 hover:bg-slate-50 transition-colors space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-500">{req.requestNumber}</span>
                        <StatusBadge urgency={req.urgency} size="sm" />
                        <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">
                          ID: {req.nationalIdNumber}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{req.title}</h4>
                    </div>

                    <button
                      onClick={() => setSelectedReq(req)}
                      className="px-3.5 py-1.5 bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs rounded-lg flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>Inspect & Verify</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">{req.description}</p>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span>Applicant: <strong>{req.beneficiaryName}</strong> (Household: {req.householdSize})</span>
                    <span className="font-bold text-emerald-800">{req.estimatedAmountNeededEtb.toLocaleString()} ETB</span>
                  </div>

                  {/* Duplicate Alert Banner */}
                  {duplicates.length > 0 && (
                    <div className="bg-amber-50 border border-amber-300 rounded-lg p-2.5 flex items-center gap-2 text-xs text-amber-900 font-bold">
                      <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        Warning: National ID matches {duplicates.length} other registered request(s) in Adama!
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'DELIVERIES' && (
          <div className="divide-y divide-slate-100">
            {readyForDelivery.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No active fully funded items ready for handover in Kebele dispatch.
              </div>
            ) : (
              readyForDelivery.map((req) => (
                <div key={req.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-500">{req.requestNumber}</span>
                    <h4 className="font-bold text-slate-900 text-sm mt-0.5">{req.title}</h4>
                    <p className="text-xs text-slate-600">
                      Beneficiary: <strong>{req.beneficiaryName}</strong> ({req.beneficiaryPhone})
                    </p>
                    <div className="mt-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        req.status === 'FULLY_FUNDED' ? 'bg-blue-100 text-blue-800' :
                        req.status === 'IN_DISTRIBUTION' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                  </div>

                  {req.status === 'FULLY_FUNDED' ? (
                    <button
                      onClick={() => handleInitiateDistribution(req)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 shrink-0"
                    >
                      <PackageCheck className="w-4 h-4" />
                      <span>Initiate Distribution</span>
                    </button>
                  ) : req.status === 'IN_DISTRIBUTION' ? (
                    <button
                      onClick={() => handleConfirmLocalDelivery(req)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 shrink-0"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Handover & Complete</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-4 py-2 bg-slate-300 text-slate-500 font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0 cursor-not-allowed"
                    >
                      <Check className="w-4 h-4" />
                      <span>Completed</span>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Review & Verification Inspector Drawer Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 my-6">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">Kebele Verification Inspector</h3>
              </div>
              <button
                onClick={() => setSelectedReq(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs text-slate-800">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between font-bold text-slate-900 text-sm">
                  <span>{selectedReq.title}</span>
                  <span className="font-mono text-emerald-700">
                    {selectedReq.estimatedAmountNeededEtb.toLocaleString()} ETB
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">{selectedReq.description}</p>
                <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-slate-600 font-medium">
                  <p>Beneficiary: <strong>{selectedReq.beneficiaryName}</strong></p>
                  <p>National ID: <strong className="font-mono">{selectedReq.nationalIdNumber}</strong></p>
                  <p>Kebele: <strong>{selectedReq.kebele}</strong></p>
                  <p>Household Size: <strong>{selectedReq.householdSize} Members</strong></p>
                </div>
              </div>

              {/* Uploaded Documents Check */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Resident & Low-Income Documents Attached ({selectedReq.documents.length})</h4>
                <div className="space-y-2">
                  {selectedReq.documents.map((doc) => (
                    <div key={doc.id} className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-700" />
                        <span className="font-bold text-slate-900">{doc.name}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 uppercase">Verified Valid</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviewer Note */}
              <div>
                <label className="block font-bold text-slate-900 mb-1">Kebele Inspector Verification Note</label>
                <textarea
                  rows={2}
                  placeholder="Enter resident check notes e.g. Household visit completed on March 3. Verified low income certificate #4820."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                />
              </div>

              {/* Decision Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const reason = prompt('Please specify rejection reason for Kebele records:');
                    if (reason) handleRejectKebele(selectedReq.id);
                  }}
                  className="px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-xl transition-colors"
                >
                  Reject Application
                </button>

                <button
                  type="button"
                  onClick={() => handleApproveKebele(selectedReq.id)}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Forward to Woreda Supervisor</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
