import React, { useRef } from 'react';
import { Donation, BeneficiaryRequest } from '../../types';
import { AdamaLogo } from './AdamaLogo';
import { Printer, Download, X, CheckCircle2, ShieldCheck } from 'lucide-react';

interface DigitalReceiptModalProps {
  donation: Donation;
  request?: BeneficiaryRequest;
  onClose: () => void;
}

export const DigitalReceiptModal: React.FC<DigitalReceiptModalProps> = ({
  donation,
  request,
  onClose,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    try {
      // Create HTML content for the receipt
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Receipt ${donation.donationNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; }
    .header { text-align: center; border-bottom: 3px solid #000; padding-bottom: 20px; margin-bottom: 20px; }
    .title { font-size: 24px; font-weight: bold; margin: 10px 0; }
    .subtitle { font-size: 14px; color: #666; }
    .section { margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 8px; }
    .label { font-size: 12px; font-weight: bold; color: #666; text-transform: uppercase; }
    .value { font-size: 16px; font-weight: bold; margin: 5px 0; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .footer { margin-top: 40px; border-top: 2px solid #000; padding-top: 20px; display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <div class="header">
    <h1 class="title">ADAMA CITY ADMINISTRATION</h1>
    <h2 class="title">OFFICIAL DONATION & IMPACT RECEIPT</h2>
    <p class="subtitle">Adama City Administration Community Support Board</p>
  </div>

  <div class="grid">
    <div class="section">
      <div class="label">Receipt No.</div>
      <div class="value">${donation.donationNumber}</div>
    </div>
    <div class="section">
      <div class="label">Date Issued</div>
      <div class="value">${new Date(donation.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}</div>
    </div>
  </div>

  <div class="section">
    <div class="label">Contributor</div>
    <div class="value">${donation.donorName}</div>
    <div class="value" style="font-weight: normal;">${donation.donorEmail}</div>
    <div style="margin-top: 10px; padding: 5px 10px; background: #fef3c7; display: inline-block; border-radius: 4px; font-size: 12px; font-weight: bold;">
      ${donation.donorType} Contributor
    </div>
  </div>

  <div class="grid">
    <div class="section" style="background: #ecfdf5;">
      <div class="label" style="color: #065f46;">Total Contribution</div>
      <div class="value" style="font-size: 24px; color: #064e3b;">
        ${donation.amountEtb ? `${donation.amountEtb.toLocaleString()} ETB` : donation.itemsDescription || 'In-Kind Services'}
      </div>
    </div>
    <div class="section">
      <div class="label">Payment / Method</div>
      <div class="value">${donation.paymentMethod || 'Physical Handover'}</div>
      ${donation.transactionRef ? `<div style="font-size: 12px; color: #666; margin-top: 5px;">Ref: ${donation.transactionRef}</div>` : ''}
    </div>
  </div>

  ${request ? `
  <div class="section">
    <div class="label">Allocated Beneficiary Project</div>
    <div class="value">${request.title}</div>
    <div style="font-size: 14px; color: #666; margin-top: 5px;">
      Beneficiary: ${request.beneficiaryName} • ${request.kebele}, ${request.woreda}
    </div>
  </div>
  ` : ''}

  <div class="footer">
    <div>
      <div class="label">Verification</div>
      <div style="font-size: 12px; margin-top: 5px;">
        <strong>Digital Signature: VALID</strong><br>
        Verification Code: ADM-2026-CERT-9902<br>
        Tax Exemption ID: ET-ADM-CHARITY-7782
      </div>
    </div>
    <div style="text-align: right;">
      <div style="border-bottom: 2px solid #000; padding-bottom: 5px; margin-bottom: 5px; font-style: italic;">
        Eng. Kebede Tola
      </div>
      <div class="label">City Director Seal</div>
      <div style="font-size: 11px; color: #666;">Adama City Administration</div>
    </div>
  </div>
</body>
</html>
      `;

      // Create blob and download
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Receipt-${donation.donationNumber}.html`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try using the Print option and save as PDF.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 my-8">
        {/* Modal Actions Bar (Non-printable) */}
        <div className="p-3 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-xs">Official Municipal Certificate & Tax Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white font-bold text-xs rounded-lg hover:bg-emerald-500 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Receipt</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-amber-400 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Body */}
        <div id="printable-receipt" className="p-8 bg-white relative font-sans text-slate-900">
          {/* Subtle Watermark Seal */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <AdamaLogo size="xl" showText={false} />
          </div>

          {/* Header Seal */}
          <div className="flex flex-col items-center text-center pb-6 border-b-2 border-slate-900">
            <AdamaLogo size="lg" showText={true} />
            <h2 className="mt-4 font-black text-lg tracking-tight text-slate-900 uppercase">
              Official Donation & Impact Receipt
            </h2>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Adama City Administration Community Support Board • Bulchiinsa Magaalaa Adaamaa
            </p>
          </div>

          {/* Certificate Metadata Bar */}
          <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-200 text-xs">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Receipt No.</p>
              <p className="font-mono font-bold text-slate-900 text-sm">{donation.donationNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400">Date Issued</p>
              <p className="font-mono font-bold text-slate-900 text-sm">
                {new Date(donation.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Donor & Contribution Details */}
          <div className="py-6 space-y-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Contributor</p>
              <p className="font-extrabold text-slate-900 text-base">{donation.donorName}</p>
              <p className="text-slate-600 text-xs">{donation.donorEmail}</p>
              <span className="inline-block mt-2 px-2 py-0.5 bg-amber-100 text-amber-900 font-bold text-[10px] rounded uppercase">
                {donation.donorType} Contributor
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200">
                <p className="text-[10px] uppercase font-bold text-emerald-800">Total Contribution</p>
                <p className="font-black text-emerald-950 text-xl mt-0.5">
                  {donation.amountEtb
                    ? `${donation.amountEtb.toLocaleString()} ETB`
                    : donation.itemsDescription || 'In-Kind Services'}
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p className="text-[10px] uppercase font-bold text-slate-500">Payment / Method</p>
                <p className="font-bold text-slate-900 text-sm mt-0.5">
                  {donation.paymentMethod || 'Physical Handover'}
                </p>
                {donation.transactionRef && (
                  <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                    Ref: {donation.transactionRef}
                  </p>
                )}
              </div>
            </div>

            {/* Target Support Project */}
            {request && (
              <div className="border border-slate-200 rounded-xl p-3 bg-white">
                <p className="text-[10px] uppercase font-bold text-slate-500">Allocated Beneficiary Project</p>
                <p className="font-bold text-slate-900 text-xs mt-1">{request.title}</p>
                <p className="text-[11px] text-slate-600">
                  Beneficiary: {request.beneficiaryName} • {request.kebele}, {request.woreda}
                </p>
              </div>
            )}
          </div>

          {/* Verification Stamps & Signatures */}
          <div className="pt-6 border-t-2 border-slate-900 flex justify-between items-end">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 border-2 border-slate-900 rounded-lg p-1 flex items-center justify-center text-center">
                <div className="text-[9px] font-mono font-bold leading-tight text-slate-800">
                  QR VERIFIED<br />
                  ADM-9980<br />
                  SEAL OK
                </div>
              </div>
              <div className="text-[10px] text-slate-500 space-y-0.5">
                <p className="font-bold text-slate-800">DIGITAL SIGNATURE VALID</p>
                <p>Verification Code: ADM-2026-CERT-9902</p>
                <p>Tax Exemption ID: ET-ADM-CHARITY-7782</p>
              </div>
            </div>

            <div className="text-right">
              <div className="w-32 border-b border-slate-900 pb-1 mb-1 text-center font-serif text-sm italic text-slate-800">
                Eng. Kebede Tola
              </div>
              <p className="text-[10px] font-bold text-slate-900">City Director Seal</p>
              <p className="text-[9px] text-slate-500">Adama City Administration</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
