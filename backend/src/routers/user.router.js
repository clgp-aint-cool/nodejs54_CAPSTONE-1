import express from 'express';
import { authenticateToken } from '../common/middlewares/auth.middleware.js';
import { userController } from '../controller/user.controller.js';
import { uploadSingleImage } from '../common/middlewares/upload.middleware.js';
const router = express.Router();

router.get('/', authenticateToken, userController.getUserInfo);

router.get('/images/created', authenticateToken, userController.getUserCreatedImages);

router.get('/images/saved', authenticateToken, userController.getUserSavedImages);



router.put('/', authenticateToken, uploadSingleImage, userController.updateUser);

export default router;
