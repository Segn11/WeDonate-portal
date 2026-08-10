import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Heart,
  HandHeart,
  FileText,
  Users,
  ShieldAlert,
  Building2,
  BarChart3,
  CheckCircle2,
  PackageCheck,
  History,
  Settings,
  FolderOpen,
  MapPin,
  Globe,
  Server,
  Shield,
  Key,
  UserCheck,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { currentUser } = useAuth();
  const role = currentUser?.role || 'DONOR';

  // Define navigation items per role
  const getNavItems = () => {
    switch (role) {
      case 'DONOR':
        return [
          { id: 'DASHBOARD', label: 'Overview', icon: LayoutDashboard },
          { id: 'BROWSE_REQUESTS', label: 'Verified Requests', icon: Heart },
          { id: 'MY_DONATIONS', label: 'My Donations & Impact', icon: HandHeart },
          { id: 'RECEIPTS', label: 'Official Receipts', icon: FileText },
          { id: 'REPORTS', label: 'City Transparency', icon: BarChart3 },
          { id: 'SETTINGS', label: 'Profile & Org Info', icon: UserCheck },
        ];

      case 'BENEFICIARY':
        return [
          { id: 'DASHBOARD', label: 'My Overview', icon: LayoutDashboard },
          { id: 'NEW_REQUEST', label: 'Apply For Support', icon: HandHeart },
          { id: 'MY_REQUESTS', label: 'Request Tracking', icon: PackageCheck },
          { id: 'REPORTS', label: 'City Transparency', icon: BarChart3 },
          { id: 'DOCUMENTS', label: 'Uploaded Documents', icon: FolderOpen },
          { id: 'SETTINGS', label: 'Profile & Family Info', icon: UserCheck },
        ];

      case 'KEBELE_ADMIN':
        return [
          { id: 'DASHBOARD', label: 'Kebele Dashboard', icon: LayoutDashboard },
          { id: 'VERIFICATION_QUEUE', label: 'Beneficiary Queue', icon: CheckCircle2, badge: 'Needs Action' },
          { id: 'DUPLICATE_CHECK', label: 'Duplicate Detector', icon: ShieldAlert },
          { id: 'DELIVERY_CONFIRM', label: 'Local Distribution', icon: PackageCheck },
          { id: 'REPORTS', label: 'City Transparency & Audit', icon: FileText },
          { id: 'SETTINGS', label: 'Profile & Kebele Credentials', icon: UserCheck },
        ];

      case 'WOREDA_ADMIN':
        return [
          { id: 'DASHBOARD', label: 'Woreda Overview', icon: LayoutDashboard },
          { id: 'REGIONAL_APPROVALS', label: 'Regional Approvals', icon: CheckCircle2, badge: 'Pending' },
          { id: 'KEBELE_MATRIX', label: 'Kebele Allocations', icon: MapPin },
          { id: 'REPORTS', label: 'Woreda Analytics', icon: BarChart3 },
          { id: 'SETTINGS', label: 'Profile & Woreda Credentials', icon: UserCheck },
        ];

      case 'CITY_ADMIN':
        return [
          { id: 'DASHBOARD', label: 'City Executive Board', icon: LayoutDashboard },
          { id: 'ALL_REQUESTS', label: 'All City Requests', icon: Heart },
          { id: 'DISTRIBUTIONS', label: 'Distribution Ledger', icon: PackageCheck },
          { id: 'USER_MANAGEMENT', label: 'Users & Admin Provisioning', icon: Users },
          { id: 'AUDIT_LOGS', label: 'Security & Audit Logs', icon: History },
          { id: 'REPORTS', label: 'City Reports & Export', icon: BarChart3 },
          { id: 'SETTINGS', label: 'Account Profile & Org Info', icon: UserCheck },
        ];

      case 'SYSTEM_ADMIN':
        return [
          { id: 'DASHBOARD', label: 'System IT Board', icon: Server },
          { id: 'USER_MANAGEMENT', label: 'Admin Account Provisioning', icon: Users },
          { id: 'AUDIT_LOGS', label: 'Technical & Audit Telemetry', icon: Shield },
          { id: 'ALL_REQUESTS', label: 'All Requests Oversight', icon: Heart },
          { id: 'DISTRIBUTIONS', label: 'Distribution Ledger', icon: PackageCheck },
          { id: 'SETTINGS', label: 'Account Profile & Org Info', icon: UserCheck },
        ];

      default:
        return [
          { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'BROWSE_REQUESTS', label: 'Requests', icon: Heart },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 text-slate-700 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        {/* Active Context Banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Jurisdiction / Area
          </p>
          <div className="flex items-center gap-2 mt-1 text-slate-900 font-extrabold text-xs truncate">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">
              {currentUser?.kebele || currentUser?.woreda || 'Adama City Administration'}
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            Main Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white font-bold shadow-sm shadow-emerald-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && !isActive && (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-[11px] text-slate-500 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official Portal v2.4</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            Adama Municipal Digitized Support System
          </p>
        </div>
      </div>
    </aside>
  );
};
