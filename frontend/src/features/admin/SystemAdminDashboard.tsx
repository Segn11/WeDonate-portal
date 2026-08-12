import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { UserRole, User } from '../../types';
import {
  Server,
  Shield,
  UserPlus,
  Lock,
  Database,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Users,
  Search,
  Key,
  Globe,
  Radio,
  FileCheck,
  Building,
} from 'lucide-react';

export const SystemAdminDashboard: React.FC = () => {
  const { users, registerUser } = useAuth();
  const { auditLogs } = useData();

  const [activeSubTab, setActiveSubTab] = useState<'OVERVIEW' | 'PROVISIONING' | 'SECURITY' | 'INTEGRATIONS' | 'AUDIT'>('OVERVIEW');
  const [searchTerm, setSearchTerm] = useState('');

  // Provisioning Modal State
  const [showProvisionModal, setShowProvisionModal] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPhone, setNewAdminPhone] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<UserRole>('KEBELE_ADMIN');
  const [newAdminKebele, setNewAdminKebele] = useState('Kebele 05 (Bole)');
  const [newAdminWoreda, setNewAdminWoreda] = useState('Bole Sub-City Woreda');
  const [provisionSuccessMsg, setProvisionSuccessMsg] = useState('');

  // Security config state
  const [jwtExpiry, setJwtExpiry] = useState('24h');
  const [requireMfa, setRequireMfa] = useState(true);
  const [ipWhitelist, setIpWhitelist] = useState('10.240.0.0/16, 196.188.0.0/16');
  const [backupSchedule, setBackupSchedule] = useState('Daily at 02:00 EAT');

  const adminUsers = (users || []).filter((u) =>
    ['KEBELE_ADMIN', 'WOREDA_ADMIN', 'CITY_ADMIN', 'SYSTEM_ADMIN'].includes(u.role)
  );

  const handleProvisionAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName || !newAdminEmail) return;

    registerUser({
      fullName: newAdminName,
      email: newAdminEmail,
      phone: newAdminPhone || '+251 90 000 0000',
      role: newAdminRole,
      city: 'Adama',
      kebele: ['KEBELE_ADMIN'].includes(newAdminRole) ? newAdminKebele : undefined,
      woreda: ['KEBELE_ADMIN', 'WOREDA_ADMIN'].includes(newAdminRole) ? newAdminWoreda : undefined,
    });

    setProvisionSuccessMsg(`Admin credentials created for ${newAdminName} (${newAdminRole}). Activation email dispatched.`);
    setNewAdminName('');
    setNewAdminEmail('');
    setNewAdminPhone('');
    setTimeout(() => {
      setShowProvisionModal(false);
      setProvisionSuccessMsg('');
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* System Admin Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-indigo-900/80 text-indigo-300 border border-indigo-700 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              System Administration & IT Security
            </span>
            <span className="text-xs text-slate-400">• Adama Infrastructure Node</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            System IT Infrastructure & Technical Portal
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Account provisioning, JWT security rules, payment API integrations, automated database backups, and technical audit logs.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <button
            onClick={() => setShowProvisionModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Provision New Admin Account</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('OVERVIEW')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'OVERVIEW'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>System Health & Overview</span>
        </button>

        <button
          onClick={() => setActiveSubTab('PROVISIONING')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'PROVISIONING'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Admin Provisioning ({adminUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('SECURITY')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'SECURITY'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Security & Auth Guards</span>
        </button>

        <button
          onClick={() => setActiveSubTab('INTEGRATIONS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'INTEGRATIONS'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Integrations & API Gateways</span>
        </button>

        <button
          onClick={() => setActiveSubTab('AUDIT')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'AUDIT'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Technical Telemetry Logs</span>
        </button>
      </div>

      {/* OVERVIEW SUB-TAB */}
      {activeSubTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[10px] font-bold uppercase tracking-wider">Database Status</span>
                <Database className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xl font-black text-slate-900">Online / Connected</p>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Latency: 14ms (Adama Region Node)</span>
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[10px] font-bold uppercase tracking-wider">Active Admin Accounts</span>
                <Users className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-xl font-black text-slate-900">{adminUsers.length} Provisioned</p>
              <p className="text-[11px] text-slate-500">Across Kebeles, Woredas & City Admin</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[10px] font-bold uppercase tracking-wider">JWT Auth Tokens</span>
                <Key className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-xl font-black text-slate-900">Secure (256-bit RSA)</p>
              <p className="text-[11px] text-slate-500">Expiry: {jwtExpiry} | Auto-refresh ON</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[10px] font-bold uppercase tracking-wider">Backup Status</span>
                <RefreshCw className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-xl font-black text-slate-900">Encrypted Snapshot</p>
              <p className="text-[11px] text-slate-500">{backupSchedule}</p>
            </div>
          </div>

          {/* System Services Grid */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-600" />
              <span>Core Platform Microservices Health</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">Auth & RBAC Guards</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    99.99% Uptime
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">Enforces role-based route access & JWT verification</p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">Document Vault Storage</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Operational
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">AES-256 encrypted resident ID & medical certificate files</p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">SMS / Telebirr Webhooks</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Connected
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">Ethio Telecom gateway for instant donor & resident OTP</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROVISIONING SUB-TAB */}
      {activeSubTab === 'PROVISIONING' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Government & Administrator Accounts</h3>
              <p className="text-xs text-slate-500">
                Admin accounts are invite-only and created exclusively by System / City Administrators.
              </p>
            </div>
            <button
              onClick={() => setShowProvisionModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Provision Admin</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-y border-slate-200 font-bold">
                  <th className="py-3 px-4">Official Name</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Jurisdiction</th>
                  <th className="py-3 px-4">Email / Phone</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {adminUsers.map((admin) => (
                  <tr key={admin.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{admin.fullName}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                      <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded text-[11px] uppercase">
                        {admin.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {admin.kebele || admin.woreda || 'Adama City Hall'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{admin.email}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        ACTIVE
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="text-indigo-600 font-bold hover:underline text-xs">
                        Reset Access Key
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECURITY SUB-TAB */}
      {activeSubTab === 'SECURITY' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-600" />
            <span>Security & Guard Configuration</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">JWT Session Lifespan</label>
                <select
                  value={jwtExpiry}
                  onChange={(e) => setJwtExpiry(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
                >
                  <option value="8h">8 Hours (Strict)</option>
                  <option value="24h">24 Hours (Standard)</option>
                  <option value="72h">72 Hours (Extended)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <p className="text-xs font-bold text-slate-900">Enforce Multi-Factor Authentication (SMS OTP)</p>
                  <p className="text-[11px] text-slate-500">Requires Ethio Telecom phone SMS code for admin sign-in</p>
                </div>
                <input
                  type="checkbox"
                  checked={requireMfa}
                  onChange={(e) => setRequireMfa(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Government Intranet IP Whitelist</label>
                <input
                  type="text"
                  value={ipWhitelist}
                  onChange={(e) => setIpWhitelist(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
                <p className="text-[10px] text-slate-500 mt-1">Comma-separated CIDR blocks for municipal admin portals.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Automated Database Snapshot Schedule</label>
                <input
                  type="text"
                  value={backupSchedule}
                  onChange={(e) => setBackupSchedule(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INTEGRATIONS SUB-TAB */}
      {activeSubTab === 'INTEGRATIONS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-slate-900">Telebirr Direct Integration</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Connected</span>
            </div>
            <p className="text-xs text-slate-600">
              Handles instant digital donation reconciliation with automatic digital receipt generation.
            </p>
            <p className="text-[11px] font-mono text-slate-400">Merchant ID: MERCH-ADA-2026-9908</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-slate-900">Commercial Bank of Ethiopia (CBE Birr)</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Connected</span>
            </div>
            <p className="text-xs text-slate-600">
              Escrow bank account synchronization for municipal charity fund management.
            </p>
            <p className="text-[11px] font-mono text-slate-400">Escrow Acc: 1000188902213 (Adama Municipal)</p>
          </div>
        </div>
      )}

      {/* AUDIT SUB-TAB */}
      {activeSubTab === 'AUDIT' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900">System Technical Event Logs</h3>
          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <span className="text-[10px] text-indigo-600 font-mono font-bold bg-indigo-50 px-1.5 py-0.5 rounded">{log.module}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{log.details} • {log.userName} ({log.role})</p>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROVISIONING MODAL */}
      {showProvisionModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900">Provision Admin Account</h3>
              </div>
              <button
                onClick={() => setShowProvisionModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {provisionSuccessMsg ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold text-center">
                {provisionSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleProvisionAdmin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Official Full Name</label>
                  <input
                    type="text"
                    required
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    placeholder="e.g. Dr. Roba Birhanu"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Government Email Address</label>
                  <input
                    type="email"
                    required
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="e.g. roba.b@adama.gov.et"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Official Phone Number</label>
                  <input
                    type="text"
                    value={newAdminPhone}
                    onChange={(e) => setNewAdminPhone(e.target.value)}
                    placeholder="+251 91 000 0000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Administrator Role Tier</label>
                  <select
                    value={newAdminRole}
                    onChange={(e) => setNewAdminRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  >
                    <option value="KEBELE_ADMIN">Kebele Administrator (Resident Verification)</option>
                    <option value="WOREDA_ADMIN">Woreda Administrator (Regional Supervisor)</option>
                    <option value="CITY_ADMIN">City Administrator (Mayor Cabinet / Oversight)</option>
                    <option value="SYSTEM_ADMIN">System Administrator (IT & Security)</option>
                  </select>
                </div>

                {newAdminRole === 'KEBELE_ADMIN' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Kebele</label>
                    <input
                      type="text"
                      value={newAdminKebele}
                      onChange={(e) => setNewAdminKebele(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowProvisionModal(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold shadow-sm"
                  >
                    Generate Credentials
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
