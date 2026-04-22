import express from 'express';
import { body } from 'express-validator';
import { authController, registerValidation, loginValidation, validate } from '../controller/auth.controller.js';

const router = express.Router();

router.post(
  '/register',
  registerValidation,
  validate,
  authController.register
);

router.post(
  '/login',
  loginValidation,
  validate,
  authController.login
);

router.post(
  '/refresh',
  validate,
  authController.refreshToken
);

router.post(
  '/logout',
  authController.logout
);

export default router;
