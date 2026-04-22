import express from 'express';
import { authenticateToken } from '../common/middlewares/auth.middleware.js';

import { savedController } from '../controller/saved.controller.js';

const router = express.Router();

router.get('/check/:imageId', authenticateToken, savedController.checkIfSaved);

router.post('/:imageId', authenticateToken, savedController.saveImage);

router.delete('/:imageId', authenticateToken, savedController.unsaveImage);

router.get('/', authenticateToken, savedController.getSavedImages);

export default router;
