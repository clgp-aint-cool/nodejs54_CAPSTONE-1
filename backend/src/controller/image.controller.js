import { asyncWrapper } from '../common/helpers/app-error.helper.js';
import { successResponse, errorResponse } from '../common/helpers/response.helper.js';
import { imageService } from '../service/image.service.js';

export const imageController = {
  getAllImages: asyncWrapper(async (req, res) => {
    const { page = 1, limit = 20, search } = req.query;

    const result = await imageService.getAllImages(
      parseInt(page),
      parseInt(limit),
      search || null
    );

    successResponse(res, 200, 'Images retrieved successfully', result);
  }),

  getImageById: asyncWrapper(async (req, res) => {
    const { id } = req.params;

    const image = await imageService.getImageById(parseInt(id));

    successResponse(res, 200, 'Image retrieved successfully', { image });
  }),

  createImage: asyncWrapper(async (req, res) => {
    const { ten_hinh, mo_ta } = req.body;
    const userId = req.user.nguoi_dung_id;

    if (!req.file) {
      return errorResponse(res, 400, 'Image file is required');
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const image = await imageService.createImage(userId, ten_hinh, imageUrl, mo_ta);

    successResponse(res, 201, 'Image created successfully', { image });
  }),

  deleteImage: asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.nguoi_dung_id;

    const result = await imageService.deleteImage(parseInt(id), userId);

    successResponse(res, 200, result.message);
  })
};
