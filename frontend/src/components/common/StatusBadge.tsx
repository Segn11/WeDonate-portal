import React from 'react';
import { RequestStatus, UrgencyLevel, SupportCategory, UserRole } from '../../types';

interface StatusBadgeProps {
  status?: RequestStatus;
  urgency?: UrgencyLevel;
  category?: SupportCategory;
  role?: UserRole;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  urgency,
  category,
  role,
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  if (status) {
    const statusConfigs: Record<
      RequestStatus,
      { label: string; bg: string; text: string; border: string }
    > = {
      DRAFT: { label: 'Draft', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
      SUBMITTED: { label: 'Submitted', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
      UNDER_KEBELE_REVIEW: { label: 'Kebele Review', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300' },
      APPROVED_BY_KEBELE: { label: 'Kebele Approved', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
      UNDER_WOREDA_REVIEW: { label: 'Woreda Review', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
      APPROVED_PUBLISHED: { label: 'Live / Verified', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
      PARTIALLY_FUNDED: { label: 'Partially Funded', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
      FULLY_FUNDED: { label: 'Fully Funded', bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
      IN_DISTRIBUTION: { label: 'In Distribution', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      COMPLETED: { label: 'Completed & Delivered', bg: 'bg-emerald-100', text: 'text-emerald-900', border: 'border-emerald-300' },
      REJECTED: { label: 'Rejected', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    };

    const config = statusConfigs[status] || statusConfigs.DRAFT;

    return (
      <span
        className={`inline-flex items-center gap-1 font-semibold rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.text.replace('text', 'bg')}`} />
        {config.label}
      </span>
    );
  }

  if (urgency) {
    const urgencyConfigs: Record<
      UrgencyLevel,
      { label: string; bg: string; text: string; border: string }
    > = {
      CRITICAL: { label: 'CRITICAL URGENCY', bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300' },
      HIGH: { label: 'High Priority', bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
      MEDIUM: { label: 'Medium', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      LOW: { label: 'Low', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
    };

    const config = urgencyConfigs[urgency];

    return (
      <span
        className={`inline-flex items-center font-bold tracking-wider uppercase rounded-md border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
      >
        {config.label}
      </span>
    );
  }

  if (category) {
    const categoryLabels: Record<SupportCategory, string> = {
      FOOD_SUPPLIES: 'Food & Rations',
      MEDICAL_HEALTH: 'Medical & Healthcare',
      EDUCATION_SCHOOLING: 'Education & Schools',
      HOUSING_SHELTER: 'Housing & Shelter',
      CLOTHING_ESSENTIALS: 'Clothing & Goods',
      DISABILITY_ASSISTANCE: 'Disability & Mobility',
      EMERGENCY_RELIEF: 'Emergency Relief',
      SKILL_TRAINING: 'Skill & Service',
    };

    return (
      <span
        className={`inline-flex items-center font-medium bg-slate-100 text-slate-800 border border-slate-200 rounded-md ${sizeClasses}`}
      >
        {categoryLabels[category] || category}
      </span>
    );
  }

  if (role) {
    const roleLabels: Record<UserRole, { label: string; color: string }> = {
      DONOR: { label: 'Donor / Contributor', color: 'bg-blue-100 text-blue-800 border-blue-200' },
      BENEFICIARY: { label: 'Beneficiary', color: 'bg-purple-100 text-purple-800 border-purple-200' },
      KEBELE_ADMIN: { label: 'Kebele Admin', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
      WOREDA_ADMIN: { label: 'Woreda Supervisor', color: 'bg-amber-100 text-amber-900 border-amber-300' },
      CITY_ADMIN: { label: 'City Administration', color: 'bg-slate-900 text-amber-400 border-slate-700' },
      SYSTEM_ADMIN: { label: 'System Admin', color: 'bg-rose-100 text-rose-800 border-rose-200' },
    };

    const config = roleLabels[role] || { label: role, color: 'bg-slate-100 text-slate-700' };

    return (
      <span
        className={`inline-flex items-center font-semibold rounded-md border ${config.color} ${sizeClasses}`}
      >
        {config.label}
      </span>
    );
  }

  return null;
};
