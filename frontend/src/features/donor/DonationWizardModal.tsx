import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { BeneficiaryRequest, SupportCategory, PaymentMethod, DonationType } from '../../types';
import { donationApi } from '../../services/donationApi';
import {
  Heart,
  DollarSign,
  Package,
  HandHeart,
  X,
  CheckCircle2,
  Smartphone,
  CreditCard,
  Building2,
  Sparkles,
} from 'lucide-react';

interface DonationWizardModalProps {
  preselectedRequest?: BeneficiaryRequest | null;
  onClose: () => void;
  onSuccess: (donationId: string) => void;
}

export const DonationWizardModal: React.FC<DonationWizardModalProps> = ({
  preselectedRequest,
  onClose,
  onSuccess,
}) => {
  const { currentUser } = useAuth();
  const { requests, refetchRequests } = useData();

  const [step, setStep] = useState<number>(preselectedRequest ? 2 : 1);
  const [selectedReqId, setSelectedReqId] = useState<string>(preselectedRequest?.id || '');
  const [donationType, setDonationType] = useState<DonationType>('MONEY');
  const [amountEtb, setAmountEtb] = useState<number>(5000);
  const [itemsDesc, setItemsDesc] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('TELEBIRR');
  const [txRef, setTxRef] = useState<string>(`TLB-${Math.floor(10000000 + Math.random() * 90000000)}`);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const selectedRequest = requests.find((r) => r.id === selectedReqId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newDonation = await donationApi.createDonation({
        donorId: currentUser?.id || 'guest-donor',
        donorName: currentUser?.fullName || 'Anonymous Contributor',
        donorEmail: currentUser?.email || 'donor@adama.gov.et',
        donorType: currentUser?.orgName ? 'NGO' : 'INDIVIDUAL',
        requestId: selectedReqId || undefined,
        targetCategory: selectedRequest?.category || 'FOOD_SUPPLIES',
        type: donationType,
        amountEtb: donationType === 'MONEY' ? amountEtb : undefined,
        itemsDescription: donationType !== 'MONEY' ? itemsDesc : undefined,
        paymentMethod: donationType === 'MONEY' ? paymentMethod : 'PHYSICAL_HANDOVER',
        transactionRef: donationType === 'MONEY' ? txRef : undefined,
      });

      // Refetch requests to update funding status
      await refetchRequests();

      setIsSubmitting(false);
      onSuccess(newDonation.id);
    } catch (error) {
      console.error('Failed to create donation:', error);
      setIsSubmitting(false);
      alert('Failed to create donation. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 my-6">
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-amber-400 fill-amber-400" />
            <div>
              <h3 className="font-bold text-sm">Contribute Support • We Donate Adama</h3>
              <p className="text-[10px] text-slate-300">Government Verified Transparency Pipeline</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Step 1: Select Target Request */}
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-slate-900 text-sm">
                Step 1: Select Verified Beneficiary Request
              </h4>
              <p className="text-xs text-slate-500">
                Choose a verified citizen request or donate to the general Adama Community Relief Fund.
              </p>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                <div
                  onClick={() => setSelectedReqId('')}
                  className={`p-3 border rounded-xl cursor-pointer transition-all ${
                    selectedReqId === ''
                      ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-400'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <p className="font-bold text-xs text-slate-900">
                    🏛️ Adama Municipal Emergency Relief Fund (General Pool)
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    City Admin will allocate funds dynamically to the highest priority Kebele cases.
                  </p>
                </div>

                {requests
                  .filter((r) => r.status === 'APPROVED_PUBLISHED' || r.status === 'PARTIALLY_FUNDED')
                  .map((req) => (
                    <div
                      key={req.id}
                      onClick={() => setSelectedReqId(req.id)}
                      className={`p-3 border rounded-xl cursor-pointer transition-all ${
                        selectedReqId === req.id
                          ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-400'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-xs text-slate-900">{req.title}</span>
                        <span className="text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded font-mono">
                          {req.kebele}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-1 mt-1">{req.description}</p>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                        <span>Beneficiary: {req.beneficiaryName}</span>
                        <span className="font-bold text-emerald-700">
                          {req.amountRaisedEtb.toLocaleString()} / {req.estimatedAmountNeededEtb.toLocaleString()} ETB
                        </span>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800"
                >
                  Continue to Payment →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Payment Details & Confirm */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Target info banner */}
              {selectedRequest ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2 text-xs">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Donating to: </span>
                    <span className="text-amber-900 font-semibold">{selectedRequest.title}</span>
                    <p className="text-[10px] text-slate-600 mt-0.5">
                      Verified by {selectedRequest.kebele} & {selectedRequest.woreda}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800">
                  Allocating to Adama General Community Relief Fund
                </div>
              )}

              {/* Donation Type Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">Contribution Type</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setDonationType('MONEY')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      donationType === 'MONEY'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <DollarSign className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                    <span className="text-xs">Financial (ETB)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDonationType('PHYSICAL_ITEM')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      donationType === 'PHYSICAL_ITEM'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Package className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                    <span className="text-xs">Physical Goods</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDonationType('SERVICE')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      donationType === 'SERVICE'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <HandHeart className="w-5 h-5 mx-auto mb-1 text-purple-400" />
                    <span className="text-xs">Services / Skill</span>
                  </button>
                </div>
              </div>

              {/* Financial Amount or Item Description */}
              {donationType === 'MONEY' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Amount (Ethiopian Birr - ETB)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="100"
                        step="500"
                        value={amountEtb}
                        onChange={(e) => setAmountEtb(Number(e.target.value))}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-base font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:bg-white"
                        required
                      />
                      <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-500">
                        ETB
                      </span>
                    </div>

                    {/* Quick amount chips */}
                    <div className="flex gap-2 mt-2">
                      {[1000, 2500, 5000, 10000, 25000].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setAmountEtb(preset)}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border ${
                            amountEtb === preset
                              ? 'bg-amber-500 text-slate-950 border-amber-500'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          +{preset.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Methods (Telebirr / CBE Birr / Bank Transfer) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-2">
                      Select Payment Gateway / Mobile Money
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'TELEBIRR', name: 'Telebirr (Ethio Telecom)', icon: Smartphone, color: 'border-blue-500 bg-blue-50/40 text-blue-900' },
                        { id: 'CBE_BIRR', name: 'CBE Birr (Commercial Bank)', icon: Building2, color: 'border-purple-500 bg-purple-50/40 text-purple-900' },
                        { id: 'BANK_TRANSFER', name: 'Direct Bank Transfer', icon: CreditCard, color: 'border-emerald-500 bg-emerald-50/40 text-emerald-900' },
                        { id: 'CARD', name: 'Visa / Mastercard / Diaspora', icon: CreditCard, color: 'border-amber-500 bg-amber-50/40 text-amber-900' },
                      ].map((pm) => {
                        const Icon = pm.icon;
                        const isSel = paymentMethod === pm.id;
                        return (
                          <button
                            key={pm.id}
                            type="button"
                            onClick={() => {
                              setPaymentMethod(pm.id as PaymentMethod);
                              setTxRef(`${pm.id.slice(0, 3)}-${Math.floor(100000 + Math.random() * 900000)}`);
                            }}
                            className={`p-3 rounded-xl border text-left flex items-center gap-2 transition-all ${
                              isSel ? `${pm.color} font-bold ring-2 ring-amber-400` : 'border-slate-200 bg-slate-50'
                            }`}
                          >
                            <Icon className="w-4 h-4 shrink-0" />
                            <span className="text-xs">{pm.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Transaction Reference Number
                    </label>
                    <input
                      type="text"
                      value={txRef}
                      onChange={(e) => setTxRef(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Describe Physical Goods / Services Offered
                  </label>
                  <textarea
                    rows={3}
                    placeholder="E.g. 50kg Teff sacks, 5 wheelchairs, 10 hours medical consultation..."
                    value={itemsDesc}
                    onChange={(e) => setItemsDesc(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                    required
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Kebele officials will arrange local handover at Adama Central Warehouse.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                {!preselectedRequest && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-slate-600 font-bold hover:underline"
                  >
                    ← Back to Request Selection
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="ml-auto flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Processing Transaction...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Donation & Issue Receipt</span>
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
