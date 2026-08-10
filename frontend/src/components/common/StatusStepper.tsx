import React from 'react';
import { RequestStatus } from '../../types';
import { CheckCircle2, Clock, AlertCircle, ShieldCheck, Building2, Landmark, Heart, Truck, CheckCheck } from 'lucide-react';

interface StatusStepperProps {
  currentStatus: RequestStatus;
  statusHistory?: {
    status: RequestStatus;
    updatedAt: string;
    updatedBy: string;
    comment?: string;
  }[];
}

const STEPS = [
  {
    key: 'SUBMITTED',
    label: 'Submitted',
    sublabel: 'Beneficiary Request',
    icon: Clock,
  },
  {
    key: 'UNDER_KEBELE_REVIEW',
    label: 'Kebele Review',
    sublabel: 'Resident & Poverty Check',
    icon: Building2,
  },
  {
    key: 'UNDER_WOREDA_REVIEW',
    label: 'Woreda Approval',
    sublabel: 'Regional Supervisor',
    icon: Landmark,
  },
  {
    key: 'APPROVED_PUBLISHED',
    label: 'Published',
    sublabel: 'Open for Donations',
    icon: Heart,
  },
  {
    key: 'FULLY_FUNDED',
    label: 'Fully Funded',
    sublabel: 'Target Goal Met',
    icon: ShieldCheck,
  },
  {
    key: 'IN_DISTRIBUTION',
    label: 'Distribution',
    sublabel: 'Kebele Dispatch',
    icon: Truck,
  },
  {
    key: 'COMPLETED',
    label: 'Completed',
    sublabel: 'Verified Delivery',
    icon: CheckCheck,
  },
];

const getStepOrder = (status: RequestStatus): number => {
  switch (status) {
    case 'DRAFT':
      return 0;
    case 'SUBMITTED':
      return 1;
    case 'UNDER_KEBELE_REVIEW':
      return 2;
    case 'APPROVED_BY_KEBELE':
      return 2;
    case 'UNDER_WOREDA_REVIEW':
      return 3;
    case 'APPROVED_PUBLISHED':
      return 4;
    case 'PARTIALLY_FUNDED':
      return 4;
    case 'FULLY_FUNDED':
      return 5;
    case 'IN_DISTRIBUTION':
      return 6;
    case 'COMPLETED':
      return 7;
    case 'REJECTED':
      return -1;
    default:
      return 1;
  }
};

export const StatusStepper: React.FC<StatusStepperProps> = ({ currentStatus, statusHistory = [] }) => {
  const activeOrder = getStepOrder(currentStatus);

  if (currentStatus === 'REJECTED') {
    const rejectionNote = statusHistory.find((s) => s.status === 'REJECTED')?.comment;
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-rose-900 text-sm">Request Rejected</h4>
          <p className="text-xs text-rose-700 mt-0.5">
            {rejectionNote || 'This request was rejected during administrative verification.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-2">
      <div className="relative flex items-center justify-between">
        {/* Connecting Line Background */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-200 z-0" />
        
        {/* Active Progress Line */}
        <div
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-emerald-600 z-0 transition-all duration-500"
          style={{
            width: `${Math.min(100, Math.max(0, ((activeOrder - 1) / (STEPS.length - 1)) * 100))}%`,
          }}
        />

        {/* Steps */}
        {STEPS.map((step, idx) => {
          const stepNumber = idx + 1;
          const isDone = activeOrder > stepNumber;
          const isCurrent = activeOrder === stepNumber;
          const Icon = step.icon;

          const historyItem = statusHistory.find(
            (h) => h.status === step.key || (step.key === 'UNDER_KEBELE_REVIEW' && h.status === 'APPROVED_BY_KEBELE')
          );

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 border-2 ${
                  isDone
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                    : isCurrent
                    ? 'bg-amber-500 border-slate-900 text-slate-950 shadow-md ring-4 ring-amber-100 scale-110'
                    : 'bg-white border-slate-300 text-slate-400'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-5 h-5 text-white" /> : <Icon className="w-4 h-4" />}
              </div>

              {/* Label */}
              <div className="mt-2 text-center max-w-[90px]">
                <p
                  className={`text-[11px] font-bold leading-tight ${
                    isCurrent ? 'text-slate-900' : isDone ? 'text-emerald-800' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-[10px] text-slate-400 hidden sm:block mt-0.5 truncate">
                  {step.sublabel}
                </p>
                {historyItem && (
                  <p className="text-[9px] text-slate-500 mt-0.5 font-mono">
                    {new Date(historyItem.updatedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
