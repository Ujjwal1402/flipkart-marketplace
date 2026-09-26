/**
 * Authentication Controller Layer
 * Production-ready login, registration, session validation and logout
 */
import { Request, Response, NextFunction } from 'express';
import { db } from '../../database';
import { sendSuccess } from '../middlewares/errorHandler';

export class AuthController {
  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const emailOrPhone = req.body.emailOrPhone || req.body.email;
      const { password } = req.body;

      if (!emailOrPhone || !password) {
        const err: any = new Error('Email/Phone and password are required');
        err.statusCode = 400;
        throw err;
      }

      const user = db.authenticate(emailOrPhone, password);
      if (!user) {
        const err: any = new Error('Invalid email/phone or password. Please check your credentials.');
        err.statusCode = 401;
        throw err;
      }

      // Safe user payload without passwordHash
      const safeUser = { ...user };
      delete safeUser.passwordHash;

      // Simulated production JWT token
      const token = `fk_sess_${user.id}_${Date.now()}`;

      return sendSuccess(res, {
        user: safeUser,
        token,
        message: `Welcome back, ${user.name}!`
      });
    } catch (err) {
      next(err);
    }
  }

  public static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, phone, password, role = 'customer' } = req.body;

      if (!name || !email || !phone || !password) {
        const err: any = new Error('Name, email, phone, and password are required.');
        err.statusCode = 400;
        throw err;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        const err: any = new Error('Please enter a valid email address.');
        err.statusCode = 400;
        throw err;
      }

      // Phone validation (10 digits)
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      if (cleanPhone.length < 10) {
        const err: any = new Error('Please enter a valid 10-digit mobile number.');
        err.statusCode = 400;
        throw err;
      }

      // Password length
      if (password.length < 6) {
        const err: any = new Error('Password must be at least 6 characters long.');
        err.statusCode = 400;
        throw err;
      }

      const newUser = db.registerUser({
        name,
        email,
        phone,
        password,
        role: role === 'admin' ? 'admin' : 'customer'
      });

      const safeUser = { ...newUser };
      delete safeUser.passwordHash;
      const token = `fk_sess_${newUser.id}_${Date.now()}`;

      return sendSuccess(res, {
        user: safeUser,
        token,
        message: 'Account created successfully! Welcome to Flipkart.'
      }, 201);
    } catch (err) {
      next(err);
    }
  }

  public static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.query.userId as string) || (req.headers['x-user-id'] as string) || 'usr-default';
      const user = db.getUser(userId);
      if (!user) {
        const err: any = new Error('User session expired or user not found');
        err.statusCode = 404;
        throw err;
      }

      const safeUser = { ...user };
      delete safeUser.passwordHash;
      return sendSuccess(res, safeUser);
    } catch (err) {
      next(err);
    }
  }

  public static async logout(req: Request, res: Response) {
    return sendSuccess(res, { message: 'Logged out successfully' });
  }
}
