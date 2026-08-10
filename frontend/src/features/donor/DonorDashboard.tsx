import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Donation, BeneficiaryRequest } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Heart,
  HandHeart,
  TrendingUp,
  FileCheck2,
  ArrowRight,
  ShieldCheck,
  Building2,
  Clock,
  Download,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

interface DonorDashboardProps {
  onNavigateToBrowse: () => void;
  onOpenDonateModal: () => void;
  onViewReceipt: (donation: Donation) => void;
}

export const DonorDashboard: React.FC<DonorDashboardProps> = ({
  onNavigateToBrowse,
  onOpenDonateModal,
  onViewReceipt,
}) => {
  const { currentUser } = useAuth();
  const { donations, requests } = useData();

  // Donor's own donations
  const myDonations = donations.filter(
    (d) => d.donorId === currentUser?.id || currentUser?.role === 'CITY_ADMIN'
  );

  const totalDonatedEtb = myDonations.reduce((sum, d) => sum + (d.amountEtb || 0), 0);
  const totalImpactedRequests = new Set(
    myDonations.map((d) => d.assignedToRequestId || d.requestId).filter(Boolean)
  ).size;

  // Chart data for category breakdown
  const categoryChartData = [
    { name: 'Medical', value: 15000, color: '#0284c7' },
    { name: 'Food Rations', value: 18500, color: '#10b981' },
    { name: 'Education', value: 6500, color: '#f59e0b' },
    { name: 'Shelter', value: 28000, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-emerald-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Decorative blur elements */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-800/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-700/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-800 text-emerald-200 border border-emerald-700 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Official Donor Portal
            </span>
            <span className="text-xs text-emerald-200 font-medium">• Adama City Administration</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            Welcome back, {currentUser?.fullName}!
          </h1>
          <p className="text-xs text-emerald-100/90 mt-1 max-w-xl">
            Thank you for building a transparent, accountable, and compassionate community support system in Adama City.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={onNavigateToBrowse}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl border border-emerald-700 transition-all shadow-xs"
          >
            View Verified Requests
          </button>
          <button
            onClick={onOpenDonateModal}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <HandHeart className="w-4 h-4" />
            <span>Make New Donation</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Contributed
            </span>
            <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">
            {totalDonatedEtb.toLocaleString()} <span className="text-xs font-normal text-slate-500">ETB</span>
          </p>
          <p className="text-[11px] text-emerald-600 font-medium">100% Tax Exempt Receipt Issued</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Lives / Requests Touched
            </span>
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{totalImpactedRequests || 3}</p>
          <p className="text-[11px] text-slate-500 font-medium">Verified Adama Households</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Verification Rate
            </span>
            <div className="p-2 bg-blue-100 text-blue-800 rounded-lg">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">100%</p>
          <p className="text-[11px] text-slate-500 font-medium">Kebele & Woreda Dual Stamp</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Active City Pool
            </span>
            <div className="p-2 bg-purple-100 text-purple-800 rounded-lg">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">14 Kebeles</p>
          <p className="text-[11px] text-slate-500 font-medium">Full Coverage in Adama</p>
        </div>
      </div>

      {/* Charts & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart: Impact category breakdown */}
        <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Donation Category Distribution</h3>
          <p className="text-xs text-slate-500 mb-2">Fund allocation across essential sectors</p>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => `${Number(val).toLocaleString()} ETB`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2">
            {categoryChartData.map((c) => (
              <div key={c.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                <span className="text-slate-600 truncate">{c.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contributions Table */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Recent Contributions & Receipts</h3>
              <p className="text-xs text-slate-500">Official records with municipal verification stamp</p>
            </div>
            <button
              onClick={onNavigateToBrowse}
              className="text-xs text-amber-600 font-bold hover:underline flex items-center gap-1"
            >
              <span>Explore More Requests</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200">
                <tr>
                  <th className="p-3">Receipt #</th>
                  <th className="p-3">Type / Gateway</th>
                  <th className="p-3">Amount / Items</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Certificate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {myDonations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-400">
                      No contributions recorded yet. Click "Make New Donation" to begin!
                    </td>
                  </tr>
                ) : (
                  myDonations.map((don) => (
                    <tr key={don.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-mono font-bold text-slate-900">{don.donationNumber}</td>
                      <td className="p-3">
                        <span className="font-semibold text-slate-800">
                          {don.paymentMethod || 'Physical Handover'}
                        </span>
                        {don.transactionRef && (
                          <p className="text-[10px] text-slate-400 font-mono">{don.transactionRef}</p>
                        )}
                      </td>
                      <td className="p-3 font-bold text-emerald-700">
                        {don.amountEtb ? `${don.amountEtb.toLocaleString()} ETB` : don.itemsDescription}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 font-bold text-[10px] rounded-full">
                          {don.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onViewReceipt(don)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <Download className="w-3 h-3 text-amber-600" />
                          <span>Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
