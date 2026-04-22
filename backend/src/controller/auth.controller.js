import { body, validationResult } from 'express-validator';
import { asyncWrapper } from '../common/helpers/app-error.helper.js';
import { successResponse, errorResponse } from '../common/helpers/response.helper.js';
import { authService } from '../service/auth.service.js';

const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('ho_ten').notEmpty().trim(),
  body('tuoi').optional().isInt({ min: 1, max: 120 })
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 400, errors.array().map(err => err.msg).join(', '));
  }
  next();
};

export const authController = {
  register: asyncWrapper(async (req, res) => {
    const { email, password, ho_ten, tuoi } = req.body;

    const result = await authService.register(email, password, ho_ten, tuoi);

    successResponse(res, 201, 'Registration successful', result);
  }),

  login: asyncWrapper(async (req, res) => {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    // Set secure cookies
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 5 * 60 * 1000 // 5 minutes (matches token expiry)
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day (matches token expiry)
    });

    successResponse(res, 200, 'Login successful', {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    });
  }),

  refreshToken: asyncWrapper(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }

    const result = await authService.refreshToken(null, refreshToken);

    // Set new secure cookies
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 5 * 60 * 1000 // 5 minutes
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    successResponse(res, 200, 'Token refreshed successfully', {});
  }),

  logout: asyncWrapper(async (req, res) => {
    // Clear cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    successResponse(res, 200, 'Logout successful', {});
  })
};

export { registerValidation, loginValidation, validate };
