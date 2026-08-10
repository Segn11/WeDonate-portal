import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ADAMA_KEBELES, ADAMA_WOREDAS } from '../../data/mockData';
import { DocumentUploader } from '../../components/common/DocumentUploader';
import { SupportCategory, UrgencyLevel } from '../../types';
import {
  HandHeart,
  CheckCircle2,
  AlertTriangle,
  FileText,
  User,
  MapPin,
  Building2,
  X,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface UploadedDoc {
  id: string;
  name: string;
  type: string;
  url: string;
  sizeKb: number;
  uploadedAt: string;
}

interface NewRequestWizardProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const NewRequestWizard: React.FC<NewRequestWizardProps> = ({ onClose, onSuccess }) => {
  const { currentUser } = useAuth();
  const { createRequest, checkDuplicateNationalId } = useData();

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form Fields
  const [beneficiaryName, setBeneficiaryName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [nationalId, setNationalId] = useState(currentUser?.nationalIdNumber || '');
  const [kebele, setKebele] = useState(currentUser?.kebele || ADAMA_KEBELES[0]);
  const [woreda, setWoreda] = useState(currentUser?.woreda || ADAMA_WOREDAS[0]);
  const [householdSize, setHouseholdSize] = useState<number>(4);

  const [category, setCategory] = useState<SupportCategory>('FOOD_SUPPLIES');
  const [urgency, setUrgency] = useState<UrgencyLevel>('HIGH');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedAmount, setEstimatedAmount] = useState<number>(15000);
  const [itemQuantity, setItemQuantity] = useState('');

  const [docs, setDocs] = useState<UploadedDoc[]>([]);

  const [duplicateWarning, setDuplicateWarning] = useState<any[]>([]);

  // Check duplicate national ID on step 1
  const handleNextFromStep1 = async () => {
    if (!nationalId) return;
    try {
      const matches = await checkDuplicateNationalId(nationalId);
      setDuplicateWarning(matches);
      setStep(2);
    } catch (error) {
      console.error('Failed to check duplicate:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createRequest({
        beneficiaryId: currentUser?.id || '',
        beneficiaryName,
        beneficiaryPhone: phone,
        nationalIdNumber: nationalId,
        kebele,
        woreda,
        category,
        urgency,
        title,
        description,
        householdSize,
        estimatedAmountNeededEtb: estimatedAmount,
        documents: docs.map(doc => ({
          name: doc.name,
          type: doc.type,
          url: doc.url,
          sizeKb: doc.sizeKb,
        })),
      });

      onSuccess();
    } catch (error: any) {
      setError(error.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 my-6">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HandHeart className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm">Adama Citizen Support Application</h3>
              <p className="text-[10px] text-slate-300">
                Official Municipal Beneficiary Verification System
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps Indicator Bar */}
        <div className="bg-slate-100 p-3 border-b border-slate-200 flex justify-around text-[11px] font-bold">
          <span className={step === 1 ? 'text-amber-600 font-extrabold' : 'text-slate-400'}>
            1. Citizen Info
          </span>
          <span className="text-slate-300">→</span>
          <span className={step === 2 ? 'text-amber-600 font-extrabold' : 'text-slate-400'}>
            2. Request Need
          </span>
          <span className="text-slate-300">→</span>
          <span className={step === 3 ? 'text-amber-600 font-extrabold' : 'text-slate-400'}>
            3. Doc Upload
          </span>
          <span className="text-slate-300">→</span>
          <span className={step === 4 ? 'text-amber-600 font-extrabold' : 'text-slate-400'}>
            4. Review & Submit
          </span>
        </div>

        {/* Wizard Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}
          {/* STEP 1: Personal / Household Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Step 1: Household & Kebele Identification</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    value={beneficiaryName}
                    onChange={(e) => setBeneficiaryName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-semibold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    National ID / Fayyaa / FIN Number *
                  </label>
                  <input
                    type="text"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Household Members Count</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={householdSize}
                    onChange={(e) => setHouseholdSize(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Adama Kebele Jurisdiction *</label>
                  <select
                    value={kebele}
                    onChange={(e) => setKebele(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800"
                  >
                    {ADAMA_KEBELES.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Sub-City Woreda *</label>
                  <select
                    value={woreda}
                    onChange={(e) => setWoreda(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800"
                  >
                    {ADAMA_WOREDAS.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextFromStep1}
                  className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800"
                >
                  Next: Need Details →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Support Need Details */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Duplicate check warning if detected */}
              {duplicateWarning.length > 0 && (
                <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900">
                    <p className="font-bold">System Notice: Existing Application Match Found</p>
                    <p className="mt-0.5">
                      National ID <strong>{nationalId}</strong> already has {duplicateWarning.length} active request(s) on file in Adama. Kebele officials will review for cross-referencing.
                    </p>
                  </div>
                </div>
              )}

              <h4 className="font-bold text-slate-900 text-sm">Step 2: Define Support Needs</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Support Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SupportCategory)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                  >
                    <option value="FOOD_SUPPLIES">Food Supplies & Grain Rations</option>
                    <option value="MEDICAL_HEALTH">Medical & Dialysis/Hospitalization</option>
                    <option value="EDUCATION_SCHOOLING">Education & School Supplies</option>
                    <option value="HOUSING_SHELTER">Housing & Roofing Repairs</option>
                    <option value="DISABILITY_ASSISTANCE">Disability & Wheelchairs</option>
                    <option value="EMERGENCY_RELIEF">Emergency Relief</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Urgency Level *</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                  >
                    <option value="CRITICAL">Critical (Immediate Crisis)</option>
                    <option value="HIGH">High Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Request Headline / Title *</label>
                <input
                  type="text"
                  placeholder="E.g. Medical Dialysis Support for Single Mother in Kebele 05"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Detailed Situation Description *</label>
                <textarea
                  rows={3}
                  placeholder="Explain household situation, medical background, or livelihood loss in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Estimated Need Amount (ETB) *</label>
                  <input
                    type="number"
                    min="1000"
                    value={estimatedAmount}
                    onChange={(e) => setEstimatedAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Specific Items (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="E.g. 50kg Teff, 1 Wheelchair"
                    value={itemQuantity}
                    onChange={(e) => setItemQuantity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-slate-600 hover:underline"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!title || !description}
                  className="px-5 py-2 bg-slate-900 disabled:opacity-50 text-white font-bold text-xs rounded-xl hover:bg-slate-800"
                >
                  Next: Upload Documents →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Document Uploads */}
          {step === 3 && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Step 3: Verification Documents Upload</h4>
              <p className="text-xs text-slate-500">
                Upload official Kebele Resident ID and low-income or medical certification for Kebele Admin verification.
              </p>

              <DocumentUploader
                label="Kebele Resident ID Card"
                docType="KEBELE_ID"
                uploadedDocs={docs}
                required={true}
                onUploadSuccess={(newDoc) => setDocs((prev) => [...prev, newDoc])}
                onRemoveDoc={(id) => setDocs((prev) => prev.filter((d) => d.id !== id))}
              />

              <DocumentUploader
                label="Poverty / Low Income Certificate from Kebele"
                docType="INCOME_LETTER"
                uploadedDocs={docs}
                onUploadSuccess={(newDoc) => setDocs((prev) => [...prev, newDoc])}
                onRemoveDoc={(id) => setDocs((prev) => prev.filter((d) => d.id !== id))}
              />

              <DocumentUploader
                label="Hospital Medical Record / Photo Proof (Optional)"
                docType="MEDICAL_DOC"
                uploadedDocs={docs}
                onUploadSuccess={(newDoc) => setDocs((prev) => [...prev, newDoc])}
                onRemoveDoc={(id) => setDocs((prev) => prev.filter((d) => d.id !== id))}
              />

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-bold text-slate-600 hover:underline"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800"
                >
                  Review Application →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Submit */}
          {step === 4 && (
            <div className="space-y-5">
              <h4 className="font-bold text-slate-900 text-sm">Step 4: Final Application Review</h4>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Citizen Applicant:</span>
                  <span className="font-bold text-slate-900">{beneficiaryName} ({nationalId})</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Kebele / Woreda:</span>
                  <span className="font-bold text-slate-900">{kebele} • {woreda}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Support Title:</span>
                  <span className="font-bold text-slate-900">{title}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Estimated Need:</span>
                  <span className="font-bold text-emerald-700">{estimatedAmount.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Attached Documents:</span>
                  <span className="font-bold text-indigo-700">{docs.length} File(s) Ready</span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  By submitting, your request will be routed to your local Kebele Administration office for house inspection and resident record verification.
                </span>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-xs font-bold text-slate-600 hover:underline"
                >
                  ← Back to Docs
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <HandHeart className="w-4 h-4" />
                      <span>Submit Application to Kebele</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
