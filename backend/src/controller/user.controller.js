import { asyncWrapper } from '../common/helpers/app-error.helper.js';
import { successResponse, errorResponse } from '../common/helpers/response.helper.js';
import { userService } from '../service/user.service.js';

export const userController = {
  getUserInfo: asyncWrapper(async (req, res) => {
    const userId = req.user.nguoi_dung_id;

    const user = await userService.getUserById(userId);

    successResponse(res, 200, 'User info retrieved successfully', { user });
  }),

  getUserCreatedImages: asyncWrapper(async (req, res) => {
    const userId = req.user.nguoi_dung_id;
    const { page = 1, limit = 20 } = req.query;

    const result = await userService.getUserCreatedImages(userId, parseInt(page), parseInt(limit));

    successResponse(res, 200, 'Created images retrieved successfully', result);
  }),

  getUserSavedImages: asyncWrapper(async (req, res) => {
    const userId = req.user.nguoi_dung_id;
    const { page = 1, limit = 20 } = req.query;

    const result = await userService.getUserSavedImages(userId, parseInt(page), parseInt(limit));

    successResponse(res, 200, 'Saved images retrieved successfully', result);
  }),

  updateUser: asyncWrapper(async (req, res) => {
    const userId = req.user.nguoi_dung_id;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.anh_dai_dien = `/uploads/${req.file.filename}`;
    }

    const user = await userService.updateUser(userId, updateData);

    successResponse(res, 200, 'User updated successfully', { user });
  })
};
