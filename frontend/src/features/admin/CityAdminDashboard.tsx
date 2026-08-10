import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { UserRole } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ExportModal } from '../../components/common/ExportModal';
import {
  Building2,
  Users,
  ShieldAlert,
  History,
  TrendingUp,
  FileSpreadsheet,
  Settings,
  Search,
  CheckCircle2,
  UserCheck,
  Shield,
  Download,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const CityAdminDashboard: React.FC = () => {
  const { users, updateProfile } = useAuth();
  const { requests, donations, auditLogs } = useData();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'USERS' | 'AUDIT'>('OVERVIEW');
  const [showExportModal, setShowExportModal] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [logSearch, setLogSearch] = useState('');

  const totalFundsEtb = donations.reduce((sum, d) => sum + (d.amountEtb || 0), 0);
  const totalVerifiedBeneficiaries = requests.filter(
    (r) => r.status === 'APPROVED_PUBLISHED' || r.status === 'COMPLETED'
  ).length;

  // Kebele allocation chart data
  const kebeleChartData = [
    { kebele: 'Kebele 01', amount: 45000 },
    { kebele: 'Kebele 02', amount: 32000 },
    { kebele: 'Kebele 05', amount: 67000 },
    { kebele: 'Kebele 07', amount: 28000 },
    { kebele: 'Kebele 11', amount: 52000 },
    { kebele: 'Kebele 14', amount: 19000 },
  ];

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredLogs = auditLogs.filter(
    (l) =>
      l.userName.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.action.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.module.toLowerCase().includes(logSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* City Admin Executive Header */}
      <div className="bg-emerald-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Decorative blur elements */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-800/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-700/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-800 text-emerald-200 border border-emerald-700 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Executive City Administration
            </span>
            <span className="text-xs text-emerald-200 font-bold">• Adama Mayor Cabinet</span>
          </div>
          <h1 className="text-2xl font-black mt-1 tracking-tight">
            We Donate Adama City Oversight & Management
          </h1>
          <p className="text-xs text-emerald-100/90 mt-0.5">
            Full transparency portal, user role assignments, kebele distribution ledger, and security audit logs.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Export City Report</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 max-w-md">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'OVERVIEW'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          City Analytics
        </button>
        <button
          onClick={() => setActiveTab('USERS')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'USERS'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Users & Roles ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'AUDIT'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Audit Logs ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Total Funds Mobilized</span>
              <p className="text-2xl font-black text-slate-900">
                {totalFundsEtb.toLocaleString()} <span className="text-xs font-normal text-slate-500">ETB</span>
              </p>
              <p className="text-[11px] text-emerald-600 font-bold">100% Audit Tracked</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Verified Beneficiaries</span>
              <p className="text-2xl font-black text-slate-900">{totalVerifiedBeneficiaries}</p>
              <p className="text-[11px] text-slate-500 font-medium">Across 14 Kebeles</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Registered System Users</span>
              <p className="text-2xl font-black text-slate-900">{users.length}</p>
              <p className="text-[11px] text-indigo-600 font-bold">Donors, Admins & Beneficiaries</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Adama Sub-City Woredas</span>
              <p className="text-2xl font-black text-slate-900">4 Sub-Cities</p>
              <p className="text-[11px] text-slate-500 font-medium">Fully Digitized Operations</p>
            </div>
          </div>

          {/* Kebele Distribution Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Kebele Support Distribution Matrix (ETB)</h3>
              <p className="text-xs text-slate-500">Resource allocation comparison across Adama Kebeles</p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={kebeleChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="kebele" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(val: any) => `${Number(val).toLocaleString()} ETB`} />
                  <Bar dataKey="amount" fill="#092265" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER & ROLE MANAGEMENT */}
      {activeTab === 'USERS' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">User & Role Hierarchy Directory</h3>
              <p className="text-xs text-slate-500">Manage admin privileges for Kebele & Woreda officials</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search user name or role..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200">
                <tr>
                  <th className="p-3">User Name</th>
                  <th className="p-3">Contact Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Jurisdiction</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{u.fullName}</td>
                    <td className="p-3 text-slate-600">{u.email}</td>
                    <td className="p-3">
                      <StatusBadge role={u.role} size="sm" />
                    </td>
                    <td className="p-3 text-slate-600 font-mono text-[11px]">
                      {u.kebele || u.woreda || 'Adama City'}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full">
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT & SECURITY LOGS */}
      {activeTab === 'AUDIT' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">System Audit & Security Trail</h3>
              <p className="text-xs text-slate-500">Immutable log of all approvals, status changes, and donations</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search audit trail..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">User & Role</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Module</th>
                  <th className="p-3">Details</th>
                  <th className="p-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-[11px] text-slate-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3 font-bold text-slate-900">
                      {log.userName}
                      <span className="block text-[10px] font-mono text-slate-400">{log.role}</span>
                    </td>
                    <td className="p-3 font-mono text-amber-700 font-bold">{log.action}</td>
                    <td className="p-3 text-slate-600">{log.module}</td>
                    <td className="p-3 text-slate-700 text-[11px] max-w-xs leading-relaxed">{log.details}</td>
                    <td className="p-3 font-mono text-[11px] text-slate-400">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Export Modal Trigger */}
      {showExportModal && (
        <ExportModal
          title="Adama City Community Support Master Report"
          data={requests}
          filenamePrefix="Adama_WeDonate_Master_Report"
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
};
