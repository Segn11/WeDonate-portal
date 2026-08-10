import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { analyticsApi } from '../../services/analyticsApi';
import { ExportModal } from '../../components/common/ExportModal';
import { TransparencyPortal } from '../transparency/TransparencyPortal';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Download,
  Building2,
  Calendar,
  FileCheck2,
  ShieldCheck,
  QrCode,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const ReportsAnalyticsPage: React.FC = () => {
  const { requests, donations } = useData();
  const [showExportModal, setShowExportModal] = useState(false);
  const [reportViewTab, setReportViewTab] = useState<'TRANSPARENCY' | 'CHARTS'>('TRANSPARENCY');
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch analytics data from API
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (reportViewTab === 'CHARTS') {
        try {
          setLoading(true);
          const [monthlyTrends, categoryDist] = await Promise.all([
            analyticsApi.getMonthlyTrends(),
            analyticsApi.getCategoryDistribution(),
          ]);
          setMonthlyData(monthlyTrends);
          setCategoryData(categoryDist);
        } catch (error) {
          console.error('Failed to fetch analytics data:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchAnalyticsData();
  }, [reportViewTab]);

  return (
    <div className="space-y-6">
      {/* View Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setReportViewTab('TRANSPARENCY')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              reportViewTab === 'TRANSPARENCY'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Public Transparency & Code Verifier</span>
          </button>

          <button
            onClick={() => setReportViewTab('CHARTS')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              reportViewTab === 'CHARTS'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Executive Analytics & Trends</span>
          </button>
        </div>

        <button
          onClick={() => setShowExportModal(true)}
          className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Summary</span>
        </button>
      </div>

      {/* Main Content Render */}
      {reportViewTab === 'TRANSPARENCY' ? (
        <TransparencyPortal />
      ) : (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] px-2.5 py-0.5 rounded uppercase">
                Adama Municipal Analytics & Growth
              </span>
              <h1 className="text-2xl font-black mt-1 tracking-tight">
                City-Wide Charity & Support Performance
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                Real-time analytics for government cabinet review, diaspora donors, and NGO audits.
              </p>
            </div>
          </div>

          {/* Grid Charts */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-slate-500">Loading analytics data...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 1: Monthly Donation Trends */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Monthly Mobilization Growth (ETB)</h3>
                    <p className="text-xs text-slate-500">Donation trajectory over recent 6 months</p>
                  </div>
                  <div className="p-2 bg-amber-100 text-amber-900 rounded-lg">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>

                <div className="h-60 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData.length > 0 ? monthlyData : [{ month: 'No Data', total: 0 }]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(val: any) => `${Number(val).toLocaleString()} ETB`} />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#d97706"
                        strokeWidth={3}
                        dot={{ r: 5, fill: '#0a2540' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Category Pie Chart */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Support Sector Allocation</h3>
                    <p className="text-xs text-slate-500">Distribution across health, food, shelter & school</p>
                  </div>
                  <div className="p-2 bg-emerald-100 text-emerald-900 rounded-lg">
                    <PieIcon className="w-4 h-4" />
                  </div>
                </div>

                <div className="h-60 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData.length > 0 ? categoryData : [{ name: 'No Data', value: 1, color: '#e2e8f0' }]}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {showExportModal && (
        <ExportModal
          title="Adama Analytics & Audit Metrics"
          data={requests}
          filenamePrefix="Adama_Analytics_Report"
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
};
