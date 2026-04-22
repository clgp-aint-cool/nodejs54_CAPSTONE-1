import { asyncWrapper } from '../common/helpers/app-error.helper.js';
import { successResponse, errorResponse } from '../common/helpers/response.helper.js';
import { savedService } from '../service/saved.service.js';

export const savedController = {
  checkIfSaved: asyncWrapper(async (req, res) => {
    const { imageId } = req.params;
    const userId = req.user.nguoi_dung_id;

    const isSaved = await savedService.checkIfSaved(userId, parseInt(imageId));

    successResponse(res, 200, 'Save status checked', { saved: isSaved });
  }),

  saveImage: asyncWrapper(async (req, res) => {
    const { imageId } = req.params;
    const userId = req.user.nguoi_dung_id;

    const result = await savedService.saveImage(userId, parseInt(imageId));

    successResponse(res, 200, result.message, result);
  }),

  unsaveImage: asyncWrapper(async (req, res) => {
    const { imageId } = req.params;
    const userId = req.user.nguoi_dung_id;

    const result = await savedService.unsaveImage(userId, parseInt(imageId));

    successResponse(res, 200, result.message, result);
  }),

  getSavedImages: asyncWrapper(async (req, res) => {
    const userId = req.user.nguoi_dung_id;
    const { page = 1, limit = 20 } = req.query;

    const result = await savedService.getSavedImages(userId, parseInt(page), parseInt(limit));

    successResponse(res, 200, 'Saved images retrieved successfully', result);
  })
};
