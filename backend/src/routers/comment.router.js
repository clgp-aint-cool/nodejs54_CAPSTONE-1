import express from 'express';
import { authenticateToken } from '../common/middlewares/auth.middleware.js';
import { commentController, commentValidation } from '../controller/comment.controller.js';

const router = express.Router();

router.get('/image/:imageId', commentController.getCommentsByImageId);

router.post(
  '/image/:imageId',
  authenticateToken,
  commentValidation,
  commentController.addComment
);

router.delete('/:commentId', authenticateToken, commentController.deleteComment);

export default router;
