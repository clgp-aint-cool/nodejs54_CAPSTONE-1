import { body } from 'express-validator';
import { asyncWrapper } from '../common/helpers/app-error.helper.js';
import { successResponse, errorResponse } from '../common/helpers/response.helper.js';
import { commentService } from '../service/comment.service.js';

const commentValidation = [
  body('noi_dung').notEmpty().trim().isLength({ min: 1, max: 255 })
];

export const commentController = {
  getCommentsByImageId: asyncWrapper(async (req, res) => {
    const { imageId } = req.params;

    const comments = await commentService.getCommentsByImageId(parseInt(imageId));

    successResponse(res, 200, 'Comments retrieved successfully', { comments });
  }),

  addComment: asyncWrapper(async (req, res) => {
    const { imageId } = req.params;
    const { noi_dung } = req.body;
    const userId = req.user.nguoi_dung_id;

    const comment = await commentService.addComment(userId, parseInt(imageId), noi_dung);

    successResponse(res, 201, 'Comment added successfully', { comment });
  }),

  deleteComment: asyncWrapper(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.nguoi_dung_id;

    const result = await commentService.deleteComment(parseInt(commentId), userId);

    successResponse(res, 200, result.message);
  })
};

export { commentValidation };
