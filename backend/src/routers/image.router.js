import express from 'express';
import { authenticateToken } from '../common/middlewares/auth.middleware.js';
import { uploadSingleImage } from '../common/middlewares/upload.middleware.js';
import { imageController } from '../controller/image.controller.js';

const router = express.Router();

router.get('/', imageController.getAllImages);

router.get('/:id', imageController.getImageById);

router.post(
  '/',
  authenticateToken,
  uploadSingleImage,
  imageController.createImage
);

router.delete('/:id', authenticateToken, imageController.deleteImage);

export default router;
