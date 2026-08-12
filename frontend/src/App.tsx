import React, { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { LandingPage } from './features/landing/LandingPage';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';
import { DonorDashboard } from './features/donor/DonorDashboard';
import { BrowseRequestsPage } from './features/donor/BrowseRequestsPage';
import { DonationWizardModal } from './features/donor/DonationWizardModal';
import { GuestDonationModal } from './components/guest/GuestDonationModal';
import { BeneficiaryDashboard } from './features/beneficiary/BeneficiaryDashboard';
import { NewRequestWizard } from './features/beneficiary/NewRequestWizard';
import { KebeleAdminDashboard } from './features/admin/KebeleAdminDashboard';
import { WoredaAdminDashboard } from './features/admin/WoredaAdminDashboard';
import { CityAdminDashboard } from './features/admin/CityAdminDashboard';
import { SystemAdminDashboard } from './features/admin/SystemAdminDashboard';
import { DistributionTrackingPage } from './features/donations/DistributionTrackingPage';
import { ReportsAnalyticsPage } from './features/reports/ReportsAnalyticsPage';
import { UserProfilePage } from './features/profile/UserProfilePage';
import { DigitalReceiptModal } from './components/common/DigitalReceiptModal';
import { BeneficiaryRequest, Donation } from './types';

const MainAppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const { donations, requests, refetchRequests } = useData();

  // Navigation and auth view state
  const [authView, setAuthView] = useState<'LANDING' | 'LOGIN' | 'REGISTER'>('LANDING');
  const [activeTab, setActiveTab] = useState<string>('DASHBOARD');
  const [loginRoleHint, setLoginRoleHint] = useState<string | undefined>(undefined);

  // Modals state
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [preselectedRequest, setPreselectedRequest] = useState<BeneficiaryRequest | null>(null);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [selectedReceiptDonation, setSelectedReceiptDonation] = useState<Donation | null>(null);

  // Helper handlers
  const handleOpenDonateModalForReq = (req: BeneficiaryRequest) => {
    setPreselectedRequest(req);
    setShowDonateModal(true);
  };

  const handleOpenGenericDonateModal = () => {
    setPreselectedRequest(null);
    setShowDonateModal(true);
  };

  const handleDonationSuccess = (donationId: string) => {
    setShowDonateModal(false);
    const found = donations.find((d) => d.id === donationId);
    if (found) {
      setSelectedReceiptDonation(found);
    }
  };

  const handleOpenLoginWithRole = (roleHint?: string) => {
    setLoginRoleHint(roleHint);
    setAuthView('LOGIN');
  };

  // 1. Unauthenticated Visitor Flow
  if (!currentUser) {
    if (authView === 'LOGIN') {
      return (
        <LoginPage
          initialRoleHint={loginRoleHint}
          onGoToRegister={() => setAuthView('REGISTER')}
          onBackToLanding={() => setAuthView('LANDING')}
        />
      );
    }

    if (authView === 'REGISTER') {
      return (
        <RegisterPage
          onGoToLogin={() => setAuthView('LOGIN')}
          onBackToLanding={() => setAuthView('LANDING')}
        />
      );
    }

    // Default Public Landing Page for unauthenticated visitors
    return (
      <>
        <LandingPage
          onOpenDonateModal={handleOpenGenericDonateModal}
          onSelectRequestForDonation={handleOpenDonateModalForReq}
          onOpenNewRequestModal={() => setAuthView('REGISTER')}
          onOpenLoginModal={handleOpenLoginWithRole}
          onOpenRegisterModal={() => setAuthView('REGISTER')}
          onNavigateToBrowse={() => setAuthView('LOGIN')}
        />

        {showDonateModal && (
          <GuestDonationModal
            preselectedRequest={preselectedRequest}
            onClose={() => setShowDonateModal(false)}
            onSuccess={() => {
              setShowDonateModal(false);
              refetchRequests();
            }}
          />
        )}

        {selectedReceiptDonation && (
          <DigitalReceiptModal
            donation={selectedReceiptDonation}
            request={requests.find(
              (r) => r.id === selectedReceiptDonation.assignedToRequestId || r.id === selectedReceiptDonation.requestId
            )}
            onClose={() => setSelectedReceiptDonation(null)}
          />
        )}
      </>
    );
  }

  // 2. Authenticated Portal Flow
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800">
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        onOpenNewRequestModal={() => setShowNewRequestModal(true)}
        onOpenDonateModal={handleOpenGenericDonateModal}
        onNavigateToModule={(mod) => setActiveTab(mod)}
      />

      {activeTab === 'PUBLIC_LANDING' ? (
        <div className="flex-1 overflow-y-auto pb-12">
          <LandingPage
            hideHeader={true}
            onOpenDonateModal={handleOpenGenericDonateModal}
            onSelectRequestForDonation={handleOpenDonateModalForReq}
            onOpenNewRequestModal={() => setShowNewRequestModal(true)}
            onOpenLoginModal={() => setActiveTab('DASHBOARD')}
            onOpenRegisterModal={() => setActiveTab('DASHBOARD')}
            onNavigateToBrowse={() => setActiveTab('BROWSE_REQUESTS')}
          />
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden max-w-7xl w-full mx-auto">
          {/* Role-Aware Sidebar */}
          <Sidebar activeTab={activeTab} onTabChange={(tabId) => setActiveTab(tabId)} />

          {/* Main Content View Container */}
          <main className="flex-1 p-6 overflow-y-auto">
            {/* DASHBOARD TAB */}
            {activeTab === 'DASHBOARD' && (
              <>
                {currentUser.role === 'DONOR' ? (
                  <DonorDashboard
                    onNavigateToBrowse={() => setActiveTab('BROWSE_REQUESTS')}
                    onOpenDonateModal={handleOpenGenericDonateModal}
                    onViewReceipt={(don) => setSelectedReceiptDonation(don)}
                  />
                ) : currentUser.role === 'BENEFICIARY' ? (
                  <BeneficiaryDashboard
                    onOpenNewRequestModal={() => setShowNewRequestModal(true)}
                  />
                ) : currentUser.role === 'KEBELE_ADMIN' ? (
                  <KebeleAdminDashboard />
                ) : currentUser.role === 'WOREDA_ADMIN' ? (
                  <WoredaAdminDashboard />
                ) : currentUser.role === 'SYSTEM_ADMIN' ? (
                  <SystemAdminDashboard />
                ) : (
                  <CityAdminDashboard />
                )}
              </>
            )}

            {/* BROWSE REQUESTS CATALOG */}
            {(activeTab === 'BROWSE_REQUESTS' || activeTab === 'ALL_REQUESTS') && (
              <BrowseRequestsPage
                onSelectRequestForDonation={handleOpenDonateModalForReq}
                onViewRequestDetails={(req) => handleOpenDonateModalForReq(req)}
              />
            )}

            {/* MY DONATIONS / RECEIPTS */}
            {(activeTab === 'MY_DONATIONS' || activeTab === 'RECEIPTS') && (
              <DonorDashboard
                onNavigateToBrowse={() => setActiveTab('BROWSE_REQUESTS')}
                onOpenDonateModal={handleOpenGenericDonateModal}
                onViewReceipt={(don) => setSelectedReceiptDonation(don)}
              />
            )}

            {/* VERIFICATION QUEUE */}
            {activeTab === 'VERIFICATION_QUEUE' && <KebeleAdminDashboard />}

            {/* REGIONAL APPROVALS */}
            {activeTab === 'REGIONAL_APPROVALS' && <WoredaAdminDashboard />}

            {/* DISTRIBUTIONS LEDGER */}
            {(activeTab === 'DISTRIBUTIONS' || activeTab === 'DELIVERY_CONFIRM') && (
              <DistributionTrackingPage />
            )}

            {/* USER MANAGEMENT & AUDIT LOGS */}
            {(activeTab === 'USER_MANAGEMENT' || activeTab === 'AUDIT_LOGS') && (
              <>
                {currentUser.role === 'SYSTEM_ADMIN' ? (
                  <SystemAdminDashboard />
                ) : (
                  <CityAdminDashboard />
                )}
              </>
            )}

            {/* ACCOUNT PROFILE & ORG INFO */}
            {(activeTab === 'SETTINGS' || activeTab === 'PROFILE') && (
              <UserProfilePage />
            )}

            {/* REPORTS, TRANSPARENCY & ANALYTICS */}
            {(activeTab === 'REPORTS' || activeTab === 'KEBELE_REPORTS' || activeTab === 'TRANSPARENCY') && (
              <ReportsAnalyticsPage />
            )}

            {/* BENEFICIARY SPECIFIC TABS: MY_REQUESTS & DOCUMENTS */}
            {(activeTab === 'MY_REQUESTS' || activeTab === 'DOCUMENTS') && (
              <BeneficiaryDashboard
                onOpenNewRequestModal={() => setShowNewRequestModal(true)}
                initialTab={activeTab}
              />
            )}

            {/* NEW REQUEST TAB SHORTCUT */}
            {activeTab === 'NEW_REQUEST' && (
              <BeneficiaryDashboard
                onOpenNewRequestModal={() => setShowNewRequestModal(true)}
                initialTab="MY_REQUESTS"
              />
            )}
          </main>
        </div>
      )}

      {/* MODALS */}
      {showDonateModal && (
        <DonationWizardModal
          preselectedRequest={preselectedRequest}
          onClose={() => setShowDonateModal(false)}
          onSuccess={handleDonationSuccess}
        />
      )}

      {showNewRequestModal && (
        <NewRequestWizard
          onClose={() => setShowNewRequestModal(false)}
          onSuccess={() => {
            setShowNewRequestModal(false);
            setActiveTab('DASHBOARD');
          }}
        />
      )}

      {selectedReceiptDonation && (
        <DigitalReceiptModal
          donation={selectedReceiptDonation}
          request={requests.find(
            (r) => r.id === selectedReceiptDonation.assignedToRequestId || r.id === selectedReceiptDonation.requestId
          )}
          onClose={() => setSelectedReceiptDonation(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <GoogleOAuthProvider clientId="976831747089-59oollntskrr46rm57rt4hrhnb2jv1ov.apps.googleusercontent.com">
      <AuthProvider>
        <DataProvider>
          <MainAppContent />
        </DataProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
