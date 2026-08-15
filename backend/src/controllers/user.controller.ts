import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendError } from '../utils/response';
import { prisma } from '../prisma/client';

export class UserController {
  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return sendError(res, 'User not authenticated', 401);
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          role: true,
          avatarUrl: true,
          city: true,
          woreda: true,
          kebele: true,
          nationalIdNumber: true,
          orgName: true,
          orgRegNumber: true,
          googleConnected: true,
          isVerified: true,
          status: true,
          bio: true,
          address: true,
          taxId: true,
          website: true,
          department: true,
          donorType: true,
          householdSize: true,
          language: true,
          emailNotifications: true,
          smsNotifications: true,
          twoFactorEnabled: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return sendError(res, 'User not found', 404);
      }

      return sendSuccess(res, user, 'User profile fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return sendError(res, 'User not authenticated', 401);
      }

      const {
        fullName,
        phone,
        bio,
        address,
        taxId,
        website,
        department,
        householdSize,
        language,
        emailNotifications,
        smsNotifications,
      } = req.body;

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(fullName && { fullName }),
          ...(phone && { phone }),
          ...(bio !== undefined && { bio }),
          ...(address !== undefined && { address }),
          ...(taxId !== undefined && { taxId }),
          ...(website !== undefined && { website }),
          ...(department !== undefined && { department }),
          ...(householdSize !== undefined && { householdSize }),
          ...(language && { language }),
          ...(emailNotifications !== undefined && { emailNotifications }),
          ...(smsNotifications !== undefined && { smsNotifications }),
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          role: true,
          avatarUrl: true,
          city: true,
          woreda: true,
          kebele: true,
          bio: true,
          address: true,
          language: true,
          emailNotifications: true,
          smsNotifications: true,
          updatedAt: true,
        },
      });

      return sendSuccess(res, updatedUser, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { role, status, page = 1, limit = 10 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const where: any = {};
      if (role) where.role = Array.isArray(role) ? role[0] : role;
      if (status) where.status = Array.isArray(status) ? status[0] : status;

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            role: true,
            avatarUrl: true,
            city: true,
            woreda: true,
            kebele: true,
            isVerified: true,
            status: true,
            createdAt: true,
          },
          skip,
          take: Number(limit),
          orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count({ where }),
      ]);

      return sendSuccess(
        res,
        { users, total, page: Number(page), limit: Number(limit) },
        'Users fetched successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateUserStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const idStr = Array.isArray(id) ? id[0] : id;
      const { status, isVerified } = req.body;

      const updatedUser = await prisma.user.update({
        where: { id: idStr },
        data: {
          ...(status && { status: Array.isArray(status) ? status[0] : status }),
          ...(isVerified !== undefined && { isVerified }),
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          status: true,
          isVerified: true,
          updatedAt: true,
        },
      });

      return sendSuccess(res, updatedUser, 'User status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const idStr = Array.isArray(id) ? id[0] : id;
      const currentUserId = req.user?.id;
      const currentUserRole = req.user?.role;

      // Users can only view their own profile unless they are admins
      if (idStr !== currentUserId && 
          currentUserRole && 
          !['CITY_ADMIN', 'SYSTEM_ADMIN', 'WOREDA_ADMIN', 'KEBELE_ADMIN'].includes(currentUserRole)) {
        return sendError(res, 'Access denied. You can only view your own profile.', 403);
      }

      const user = await prisma.user.findUnique({
        where: { id: idStr },
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          role: true,
          avatarUrl: true,
          city: true,
          woreda: true,
          kebele: true,
          nationalIdNumber: true,
          orgName: true,
          orgRegNumber: true,
          googleConnected: true,
          isVerified: true,
          status: true,
          bio: true,
          address: true,
          taxId: true,
          website: true,
          department: true,
          donorType: true,
          householdSize: true,
          language: true,
          emailNotifications: true,
          smsNotifications: true,
          twoFactorEnabled: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return sendError(res, 'User not found', 404);
      }

      return sendSuccess(res, user, 'User profile fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const idStr = Array.isArray(id) ? id[0] : id;
      const currentUserId = req.user?.id;
      const currentUserRole = req.user?.role;

      // Users can only update their own profile unless they are admins
      if (idStr !== currentUserId && 
          currentUserRole && 
          !['CITY_ADMIN', 'SYSTEM_ADMIN', 'WOREDA_ADMIN', 'KEBELE_ADMIN'].includes(currentUserRole)) {
        return sendError(res, 'Access denied. You can only update your own profile.', 403);
      }

      const {
        fullName,
        phone,
        bio,
        address,
        taxId,
        website,
        department,
        householdSize,
        language,
        emailNotifications,
        smsNotifications,
        status,
        isVerified,
      } = req.body;

      // Only admins can update status and isVerified
      const updateData: any = {};
      if (fullName) updateData.fullName = fullName;
      if (phone) updateData.phone = phone;
      if (bio !== undefined) updateData.bio = bio;
      if (address !== undefined) updateData.address = address;
      if (taxId !== undefined) updateData.taxId = taxId;
      if (website !== undefined) updateData.website = website;
      if (department !== undefined) updateData.department = department;
      if (householdSize !== undefined) updateData.householdSize = householdSize;
      if (language) updateData.language = language;
      if (emailNotifications !== undefined) updateData.emailNotifications = emailNotifications;
      if (smsNotifications !== undefined) updateData.smsNotifications = smsNotifications;
      
      // Only admins can update these fields
      if (currentUserRole && ['CITY_ADMIN', 'SYSTEM_ADMIN', 'WOREDA_ADMIN', 'KEBELE_ADMIN'].includes(currentUserRole)) {
        if (status) updateData.status = status;
        if (isVerified !== undefined) updateData.isVerified = isVerified;
      }

      const updatedUser = await prisma.user.update({
        where: { id: idStr },
        data: updateData,
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          role: true,
          avatarUrl: true,
          city: true,
          woreda: true,
          kebele: true,
          bio: true,
          address: true,
          language: true,
          emailNotifications: true,
          smsNotifications: true,
          status: true,
          isVerified: true,
          updatedAt: true,
        },
      });

      return sendSuccess(res, updatedUser, 'User profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const idStr = Array.isArray(id) ? id[0] : id;
      const currentUserId = req.user?.id;
      const currentUserRole = req.user?.role;

      // Only SYSTEM_ADMIN and CITY_ADMIN can delete users
      if (!currentUserRole || !['SYSTEM_ADMIN', 'CITY_ADMIN'].includes(currentUserRole)) {
        return sendError(res, 'Access denied. Only administrators can delete users.', 403);
      }

      // Prevent self-deletion
      if (idStr === currentUserId) {
        return sendError(res, 'Cannot delete your own account.', 400);
      }

      await prisma.user.delete({
        where: { id: idStr },
      });

      return sendSuccess(res, null, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const idStr = Array.isArray(id) ? id[0] : id;
      const { role } = req.body;
      const currentUserId = req.user?.id;
      const currentUserRole = req.user?.role;

      // Only SYSTEM_ADMIN can change roles
      if (!currentUserRole || currentUserRole !== 'SYSTEM_ADMIN') {
        return sendError(res, 'Access denied. Only SYSTEM_ADMIN can change user roles.', 403);
      }

      // Prevent self-role-change
      if (idStr === currentUserId) {
        return sendError(res, 'Cannot change your own role.', 400);
      }

      const updatedUser = await prisma.user.update({
        where: { id: idStr },
        data: { role },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          updatedAt: true,
        },
      });

      return sendSuccess(res, updatedUser, 'User role updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async verifyBeneficiary(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const idStr = Array.isArray(id) ? id[0] : id;
      const { isVerified, rejectionReason } = req.body;
      const currentUserRole = req.user?.role;
      const currentUserKebele = req.user?.kebele;

      // Only KEBELE_ADMIN and above can verify beneficiaries
      if (!currentUserRole || !['KEBELE_ADMIN', 'WOREDA_ADMIN', 'CITY_ADMIN', 'SYSTEM_ADMIN'].includes(currentUserRole)) {
        return sendError(res, 'Access denied. Only admin roles can verify beneficiaries.', 403);
      }

      const beneficiary = await prisma.user.findUnique({
        where: { id: idStr },
      });

      if (!beneficiary) {
        return sendError(res, 'Beneficiary not found', 404);
      }

      if (beneficiary.role !== 'BENEFICIARY') {
        return sendError(res, 'User is not a beneficiary', 400);
      }

      // KEBELE_ADMIN can only verify beneficiaries in their kebele
      if (currentUserRole === 'KEBELE_ADMIN' && beneficiary.kebele !== currentUserKebele) {
        return sendError(res, 'Access denied. You can only verify beneficiaries in your kebele.', 403);
      }

      const updatedUser = await prisma.user.update({
        where: { id: idStr },
        data: {
          isVerified,
          status: isVerified ? 'ACTIVE' : 'PENDING_VERIFICATION',
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          kebele: true,
          isVerified: true,
          status: true,
          updatedAt: true,
        },
      });

      return sendSuccess(res, updatedUser, 'Beneficiary verification updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getBeneficiariesByKebele(req: Request, res: Response, next: NextFunction) {
    try {
      const { kebele } = req.query;
      const currentUserRole = req.user?.role;
      const currentUserKebele = req.user?.kebele;

      // Only admin roles can view beneficiaries by kebele
      if (!currentUserRole || !['KEBELE_ADMIN', 'WOREDA_ADMIN', 'CITY_ADMIN', 'SYSTEM_ADMIN'].includes(currentUserRole)) {
        return sendError(res, 'Access denied. Only admin roles can view beneficiaries by kebele.', 403);
      }

      // KEBELE_ADMIN can only view their own kebele
      const targetKebele = currentUserRole === 'KEBELE_ADMIN' ? currentUserKebele : kebele;

      const beneficiaries = await prisma.user.findMany({
        where: {
          role: 'BENEFICIARY',
          ...(targetKebele && { kebele: targetKebele as string }),
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          kebele: true,
          woreda: true,
          isVerified: true,
          status: true,
          householdSize: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return sendSuccess(res, beneficiaries, 'Beneficiaries fetched successfully');
    } catch (error) {
      next(error);
    }
  }
}
