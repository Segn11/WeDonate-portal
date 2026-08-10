import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { AdamaLogo } from './AdamaLogo';
import {
  Bell,
  UserCheck,
  ChevronDown,
  LogOut,
  Plus,
  HeartHandshake,
  Globe,
} from 'lucide-react';

interface HeaderProps {
  onOpenNewRequestModal?: () => void;
  onOpenDonateModal?: () => void;
  onNavigateToModule?: (module: string) => void;
  activeTab?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewRequestModal,
  onOpenDonateModal,
  onNavigateToModule,
  activeTab,
}) => {
  const { currentUser, logout } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();

  const [showNotifDrawer, setShowNotifDrawer] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const userNotifs = notifications.filter(
    (n) => n.userId === currentUser?.id || currentUser?.role === 'CITY_ADMIN'
  );
  const unreadCount = userNotifs.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 text-slate-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Seal */}
        <div className="flex items-center gap-3">
          <AdamaLogo
            size="md"
            lightText={false}
            onClick={() => onNavigateToModule?.('PUBLIC_LANDING')}
            title="Click to go to Public Landing Page"
          />
          {activeTab === 'PUBLIC_LANDING' ? (
            <button
              onClick={() => onNavigateToModule?.('DASHBOARD')}
              className="hidden sm:flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-all shadow-xs"
            >
              <span>← Return to Dashboard</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigateToModule?.('PUBLIC_LANDING')}
              className="hidden sm:flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[11px] px-2.5 py-1 rounded-lg transition-all"
              title="View Public Portal Landing Page"
            >
              <Globe className="w-3 h-3 text-emerald-600" />
              <span>Public Portal</span>
            </button>
          )}
        </div>



        {/* Right: Actions, Notifications & Profile */}
        <div className="flex items-center gap-3">
          {/* Action Buttons based on Role */}
          {currentUser?.role === 'BENEFICIARY' && onOpenNewRequestModal && (
            <button
              onClick={onOpenNewRequestModal}
              className="hidden sm:flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-sm shadow-emerald-200"
            >
              <Plus className="w-4 h-4" />
              <span>New Support Request</span>
            </button>
          )}

          {currentUser?.role === 'DONOR' && onOpenDonateModal && (
            <button
              onClick={onOpenDonateModal}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm shadow-emerald-200"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Donate Now</span>
            </button>
          )}

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDrawer(!showNotifDrawer)}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer Popover */}
            {showNotifDrawer && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-bold text-sm text-slate-900">Notifications</h3>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllNotificationsRead()}
                      className="text-[11px] text-emerald-600 font-bold hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="py-2 max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {userNotifs.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">No notifications yet.</p>
                  ) : (
                    userNotifs.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2.5 rounded-xl text-xs cursor-pointer transition-colors ${
                          !n.read ? 'bg-amber-50/80 border-l-2 border-amber-500' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-slate-900">{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
            >
              {currentUser?.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.fullName}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-xs"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
                  {currentUser?.fullName.charAt(0) || 'U'}
                </div>
              )}
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-800 truncate max-w-[120px] flex items-center gap-1">
                  <span>{currentUser?.fullName}</span>
                  {currentUser?.googleConnected && (
                    <span title="Signed in with Google Account" className="inline-flex">
                      <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                    </span>
                  )}
                </p>
                <p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider truncate max-w-[120px]">
                  {currentUser?.kebele || currentUser?.woreda || 'City Admin'}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2">
                <div className="p-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-xs text-slate-900">{currentUser?.fullName}</p>
                    {currentUser?.googleConnected && (
                      <span className="bg-blue-50 text-blue-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-blue-200 flex items-center gap-1">
                        Google
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">{currentUser?.email}</p>
                  <span className="inline-block mt-2 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-mono font-bold uppercase">
                    {currentUser?.role}
                  </span>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      if (onNavigateToModule) onNavigateToModule('SETTINGS');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2"
                  >
                    <UserCheck className="w-4 h-4 text-slate-400" />
                    <span>Account Profile & Org Info</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
