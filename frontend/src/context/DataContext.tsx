import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BeneficiaryRequest,
  Donation,
  DistributionRecord,
  Notification,
  AuditLog,
  RequestStatus,
  SupportCategory,
  UrgencyLevel,
  DonationType,
  PaymentMethod,
} from '../types';
import { requestApi } from '../services/requestApi';
import { notificationApi } from '../services/notificationApi';
import { donationApi } from '../services/donationApi';
import { distributionApi } from '../services/distributionApi';
import { auditApi } from '../services/auditApi';

interface DataContextType {
  requests: BeneficiaryRequest[];
  requestsLoading: boolean;
  requestsError: string | null;
  donations: Donation[];
  distributions: DistributionRecord[];
  notifications: Notification[];
  notificationsLoading: boolean;
  auditLogs: AuditLog[];
  
  // Actions
  createRequest: (
    reqData: Omit<
      BeneficiaryRequest,
      'id' | 'requestNumber' | 'amountRaisedEtb' | 'status' | 'statusHistory' | 'createdAt' | 'updatedAt'
    >
  ) => Promise<BeneficiaryRequest>;
  
  updateRequestStatus: (
    requestId: string,
    newStatus: RequestStatus,
    updatedBy: string,
    comment?: string,
    rejectionReason?: string
  ) => Promise<void>;

  makeDonation: (
    donationData: Omit<
      Donation,
      'id' | 'donationNumber' | 'status' | 'createdAt'
    >
  ) => Donation;

  recordDistribution: (
    distData: Omit<
      DistributionRecord,
      'id' | 'distributionNumber' | 'completedAt' | 'receiptVerificationCode'
    >
  ) => DistributionRecord;

  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;

  addAuditLog: (
    userId: string,
    userName: string,
    role: any,
    action: string,
    module: string,
    details: string,
    riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH'
  ) => void;

  checkDuplicateNationalId: (nationalId: string, currentRequestId?: string) => Promise<BeneficiaryRequest[]>;
  refetchRequests: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<BeneficiaryRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState<string | null>(null);

  // Fetch requests from API on mount
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setRequestsLoading(true);
        setRequestsError(null);
        const data = await requestApi.getAllRequests();
        setRequests(data);
      } catch (error) {
        console.error('Failed to fetch requests:', error);
        setRequestsError('Failed to load requests');
      } finally {
        setRequestsLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const [donations, setDonations] = useState<Donation[]>([]);

  // Fetch donations from API on mount
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const data = await donationApi.getAllDonations();
        setDonations(data);
      } catch (error) {
        console.error('Failed to fetch donations:', error);
      }
    };
    fetchDonations();
  }, []);

  const [distributions, setDistributions] = useState<DistributionRecord[]>([]);

  // Fetch distributions from API on mount
  useEffect(() => {
    const fetchDistributions = async () => {
      try {
        const data = await distributionApi.getAllDistributions();
        setDistributions(data);
      } catch (error) {
        console.error('Failed to fetch distributions:', error);
      }
    };
    fetchDistributions();
  }, []);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Fetch audit logs from API on mount
  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const data = await auditApi.getAllAuditLogs();
        setAuditLogs(data);
      } catch (error) {
        console.error('Failed to fetch audit logs:', error);
      }
    };
    fetchAuditLogs();
  }, []);

  // Remove localStorage sync (now using API)

  // Fetch notifications from API on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setNotificationsLoading(true);
        const data = await notificationApi.getAllNotifications();
        setNotifications(data);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setNotificationsLoading(false);
      }
    };
    fetchNotifications();
  }, []);


  const addAuditLog = async (
    userId: string,
    userName: string,
    role: any,
    action: string,
    module: string,
    details: string,
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW'
  ) => {
    try {
      const newLog = await auditApi.createAuditLog({
        userId,
        userName,
        role,
        action,
        module,
        ipAddress: '197.156.98.' + Math.floor(Math.random() * 200 + 10),
        details,
        riskLevel,
      });
      setAuditLogs((prev) => [newLog, ...prev]);
    } catch (error) {
      console.error('Failed to create audit log:', error);
    }
  };

  const createRequest = async (
    reqData: Omit<
      BeneficiaryRequest,
      'id' | 'requestNumber' | 'amountRaisedEtb' | 'status' | 'statusHistory' | 'createdAt' | 'updatedAt'
    >
  ) => {
    try {
      const newReq = await requestApi.createRequest(reqData);
      setRequests((prev) => [newReq, ...prev]);
      
      // Add Audit Log
      addAuditLog(
        reqData.beneficiaryId,
        reqData.beneficiaryName,
        'BENEFICIARY',
        'SUBMIT_SUPPORT_REQUEST',
        'Beneficiary Portal',
        `Submitted request ${newReq.requestNumber} for ${reqData.category} in ${reqData.kebele}`
      );

      return newReq;
    } catch (error) {
      console.error('Failed to create request:', error);
      throw error;
    }
  };

  const updateRequestStatus = async (
    requestId: string,
    newStatus: RequestStatus,
    updatedBy: string,
    comment?: string,
    rejectionReason?: string
  ) => {
    try {
      const updated = await requestApi.updateRequestStatus(requestId, newStatus, comment, rejectionReason);
      setRequests((prev) => prev.map((req) => (req.id === requestId ? updated : req)));
      
      // Refetch all requests to ensure consistency across all views
      const allRequests = await requestApi.getAllRequests();
      setRequests(allRequests);
      
      // Audit log
      addAuditLog(
        'sys',
        updatedBy,
        'ADMIN',
        'UPDATE_REQUEST_STATUS',
        'Request Lifecycle',
        `Changed status of request ${requestId} to ${newStatus}. ${comment ? 'Comment: ' + comment : ''}`
      );
    } catch (error) {
      console.error('Failed to update request status:', error);
      throw error;
    }
  };

  const makeDonation = async (
    donationData: Omit<
      Donation,
      'id' | 'donationNumber' | 'status' | 'createdAt'
    >
  ) => {
    try {
      const newDonation = await donationApi.createDonation(donationData);
      setDonations((prev) => [newDonation, ...prev]);

      // If target request exists, update request raised amount
      if (donationData.requestId && donationData.amountEtb) {
        setRequests((prev) =>
          prev.map((r) => {
            if (r.id !== donationData.requestId) return r;
            const newRaised = r.amountRaisedEtb + (donationData.amountEtb || 0);
            let newStatus = r.status;
            if (newRaised >= r.estimatedAmountNeededEtb) {
              newStatus = 'FULLY_FUNDED';
            } else if (newRaised > 0 && r.status === 'APPROVED_PUBLISHED') {
              newStatus = 'PARTIALLY_FUNDED';
            }
            return {
              ...r,
              amountRaisedEtb: newRaised,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            };
          })
        );
      }

      // Add Audit Log
      addAuditLog(
        donationData.donorId,
        donationData.donorName,
        'DONOR',
        'MAKE_DONATION',
        'Donation Pipeline',
        `Donated ${donationData.amountEtb ? donationData.amountEtb + ' ETB' : donationData.itemsDescription} via ${donationData.paymentMethod || 'In-Kind'}`
      );

      return newDonation;
    } catch (error) {
      console.error('Failed to create donation:', error);
      throw error;
    }
  };

  const recordDistribution = async (
    distData: Omit<
      DistributionRecord,
      'id' | 'distributionNumber' | 'completedAt' | 'receiptVerificationCode'
    >
  ) => {
    try {
      const newDist = await distributionApi.createDistribution(distData);
      setDistributions((prev) => [newDist, ...prev]);

      // Update request status to COMPLETED
      await updateRequestStatus(
        distData.requestId,
        'COMPLETED',
        distData.distributedByKebeleAdmin,
        'Distribution completed and verified with beneficiary receipt.'
      );

      // Audit log
      addAuditLog(
        'admin-dist',
        distData.distributedByKebeleAdmin,
        'KEBELE_ADMIN',
        'RECORD_DISTRIBUTION',
        'Distribution Tracking',
        `Recorded distribution ${newDist.distributionNumber} for ${distData.beneficiaryName} in ${distData.kebele}`
      );

      return newDist;
    } catch (error) {
      console.error('Failed to record distribution:', error);
      throw error;
    }
  };

  const markNotificationRead = async (id: string) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const checkDuplicateNationalId = async (nationalId: string, currentRequestId?: string) => {
    if (!nationalId) return [];
    try {
      const result = await requestApi.checkDuplicateNationalId(nationalId, currentRequestId);
      return result.existingRequests;
    } catch (error) {
      console.error('Failed to check duplicate:', error);
      return [];
    }
  };

  const refetchRequests = async () => {
    try {
      setRequestsLoading(true);
      setRequestsError(null);
      const data = await requestApi.getAllRequests();
      setRequests(data);
    } catch (error) {
      console.error('Failed to refetch requests:', error);
      setRequestsError('Failed to load requests');
    } finally {
      setRequestsLoading(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        requests,
        requestsLoading,
        requestsError,
        donations,
        distributions,
        notifications,
        notificationsLoading,
        auditLogs,
        createRequest,
        updateRequestStatus,
        makeDonation,
        recordDistribution,
        markNotificationRead,
        markAllNotificationsRead,
        addAuditLog,
        checkDuplicateNationalId,
        refetchRequests,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
