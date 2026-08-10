import React, { useState } from 'react';
import { BeneficiaryRequest, PaymentMethod, DonationType } from '../../types';
import {
  Heart,
  DollarSign,
  Package,
  X,
  CheckCircle2,
  Smartphone,
  CreditCard,
  Mail,
  User,
} from 'lucide-react';

interface GuestDonationModalProps {
  preselectedRequest?: BeneficiaryRequest | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const GuestDonationModal: React.FC<GuestDonationModalProps> = ({
  preselectedRequest,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<number>(1);
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donationType, setDonationType] = useState<DonationType>('MONEY');
  const [amountEtb, setAmountEtb] = useState<number>(5000);
  const [itemsDesc, setItemsDesc] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('TELEBIRR');
  const [txRef, setTxRef] = useState<string>(`TLB-${Math.floor(10000000 + Math.random() * 90000000)}`);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
      
      const response = await fetch(`${API_BASE_URL}/donations/guest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donorName: donorName || 'Anonymous Contributor',
          donorEmail: donorEmail || 'guest@adama.gov.et',
          requestId: preselectedRequest?.id || undefined,
          targetCategory: preselectedRequest?.category || 'FOOD_SUPPLIES',
          type: donationType,
          amountEtb: donationType === 'MONEY' ? amountEtb : undefined,
          itemsDescription: donationType !== 'MONEY' ? itemsDesc : undefined,
          paymentMethod: donationType === 'MONEY' ? paymentMethod : 'PHYSICAL_HANDOVER',
          transactionRef: donationType === 'MONEY' ? txRef : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create donation');
      }

      const data = await response.json();
      setIsSubmitting(false);
      setStep(3); // Success step
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
              <h3 className="font-bold text-sm">Guest Donation • We Donate Adama</h3>
              <p className="text-[10px] text-slate-300">No registration required</p>
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
          {/* Step 1: Guest Information */}
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-slate-900 text-sm">
                Your Information (Optional)
              </h4>
              <p className="text-xs text-slate-500">
                You can donate anonymously or provide your details for receipt purposes.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="Anonymous Contributor"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email (for digital receipt)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      placeholder="guest@adama.gov.et"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>Continue to Donation</span>
                <span className="text-emerald-200">→</span>
              </button>
            </div>
          )}

          {/* Step 2: Donation Details */}
          {step === 2 && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-slate-900 text-sm">
                Donation Details
              </h4>

              {preselectedRequest && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <p className="text-xs font-bold text-emerald-900">
                    Supporting: {preselectedRequest.title}
                  </p>
                  <p className="text-[10px] text-emerald-700 mt-0.5">
                    {preselectedRequest.beneficiaryName} • {preselectedRequest.kebele}
                  </p>
                </div>
              )}

              {/* Donation Type */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDonationType('MONEY')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    donationType === 'MONEY'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <DollarSign className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
                  <p className="text-xs font-bold text-slate-900">Money</p>
                  <p className="text-[10px] text-slate-500">Telebirr / CBE</p>
                </button>

                <button
                  type="button"
                  onClick={() => setDonationType('ITEMS')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    donationType === 'ITEMS'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Package className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                  <p className="text-xs font-bold text-slate-900">Items</p>
                  <p className="text-[10px] text-slate-500">Physical goods</p>
                </button>
              </div>

              {/* Amount or Items */}
              {donationType === 'MONEY' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Amount (ETB)
                  </label>
                  <input
                    type="number"
                    value={amountEtb}
                    onChange={(e) => setAmountEtb(Number(e.target.value))}
                    min="100"
                    step="100"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Items Description
                  </label>
                  <textarea
                    value={itemsDesc}
                    onChange={(e) => setItemsDesc(e.target.value)}
                    placeholder="e.g., 50kg rice, 10 blankets, 5 school kits"
                    rows={3}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>
              )}

              {/* Payment Method */}
              {donationType === 'MONEY' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('TELEBIRR')}
                      className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 ${
                        paymentMethod === 'TELEBIRR'
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-900">Telebirr</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CBE_BANK')}
                      className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 ${
                        paymentMethod === 'CBE_BANK'
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-bold text-slate-900">CBE Bank</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Transaction Reference */}
              {donationType === 'MONEY' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Transaction Reference
                  </label>
                  <input
                    type="text"
                    value={txRef}
                    onChange={(e) => setTxRef(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Complete Donation'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center space-y-4 py-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Thank You!</h3>
                <p className="text-sm text-slate-600 mt-2">
                  Your donation has been processed successfully.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  A digital receipt will be sent to your email if provided.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onSuccess();
                  onClose();
                }}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
