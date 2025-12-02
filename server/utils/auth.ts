import jwt from 'jsonwebtoken';
import { AdminRole, AdminUser } from '@shared/api';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';

export interface AuthPayload {
  userId: string;
  email: string;
  role: AdminRole;
}

export function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
    algorithm: 'HS256',
  });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch (error) {
    return null;
  }
}

// Mock admin users for demo (in production, query database)
const DEMO_ADMINS: Record<string, { passwordHash: string; user: AdminUser }> = {
  'admin@tradehub.com': {
    passwordHash: 'hashed_password_123', // In production, use bcrypt
    user: {
      id: 'admin-001',
      email: 'admin@tradehub.com',
      fullName: 'Super Admin',
      role: 'super_admin',
      permissions: ['*'], // All permissions
      status: 'active',
      createdAt: new Date().toISOString(),
    },
  },
  'product@tradehub.com': {
    passwordHash: 'hashed_password_456',
    user: {
      id: 'admin-002',
      email: 'product@tradehub.com',
      fullName: 'Product Manager',
      role: 'product_manager',
      permissions: [
        'products.view',
        'products.create',
        'products.edit',
        'products.delete',
        'carousel.edit',
      ],
      status: 'active',
      createdAt: new Date().toISOString(),
    },
  },
  'orders@tradehub.com': {
    passwordHash: 'hashed_password_789',
    user: {
      id: 'admin-003',
      email: 'orders@tradehub.com',
      fullName: 'Order Manager',
      role: 'order_manager',
      permissions: [
        'orders.view',
        'orders.edit',
        'orders.refund',
        'payments.view',
      ],
      status: 'active',
      createdAt: new Date().toISOString(),
    },
  },
};

export function authenticateAdmin(
  email: string,
  password: string
): { user: AdminUser; token: string } | null {
  const admin = DEMO_ADMINS[email];

  if (!admin) {
    return null;
  }

  // In production, use bcrypt.compare(password, admin.passwordHash)
  if (password !== 'password123') {
    return null;
  }

  const token = generateToken({
    userId: admin.user.id,
    email: admin.user.email,
    role: admin.user.role,
  });

  return {
    user: admin.user,
    token,
  };
}

export function hasPermission(
  adminRole: AdminRole,
  requiredPermission: string
): boolean {
  const admin = Object.values(DEMO_ADMINS).find(
    (a) => a.user.role === adminRole
  );

  if (!admin) return false;
  if (admin.user.permissions.includes('*')) return true;

  return admin.user.permissions.includes(requiredPermission);
}

export function getAllAdminUsers(): AdminUser[] {
  return Object.values(DEMO_ADMINS).map((a) => a.user);
}
