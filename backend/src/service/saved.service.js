import { prisma } from '../common/prisma/prisma-client.js';

export const savedService = {
  checkIfSaved: async (userId, imageId) => {
    const saved = await prisma.luu_anh.findUnique({
      where: {
        nguoi_dung_id_hinh_id: {
          nguoi_dung_id: userId,
          hinh_id: imageId
        }
      }
    });

    return !!saved;
  },

  saveImage: async (userId, imageId) => {
    const image = await prisma.hinh_anh.findUnique({
      where: { hinh_id: imageId }
    });

    if (!image) {
      throw new Error('Image not found');
    }

    const existing = await prisma.luu_anh.findUnique({
      where: {
        nguoi_dung_id_hinh_id: {
          nguoi_dung_id: userId,
          hinh_id: imageId
        }
      }
    });

    if (existing) {
      throw new Error('Image already saved');
    }

    const saved = await prisma.luu_anh.create({
      data: {
        nguoi_dung_id: userId,
        hinh_id: imageId
      }
    });

    return { saved: true, message: 'Image saved successfully' };
  },

  unsaveImage: async (userId, imageId) => {
    const existing = await prisma.luu_anh.findUnique({
      where: {
        nguoi_dung_id_hinh_id: {
          nguoi_dung_id: userId,
          hinh_id: imageId
        }
      }
    });

    if (!existing) {
      throw new Error('Image is not saved');
    }

    await prisma.luu_anh.delete({
      where: {
        nguoi_dung_id_hinh_id: {
          nguoi_dung_id: userId,
          hinh_id: imageId
        }
      }
    });

    return { saved: false, message: 'Image unsaved successfully' };
  },

  getSavedImages: async (userId, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;

    const savedImages = await prisma.luu_anh.findMany({
      where: { nguoi_dung_id: userId },
      include: {
        hinh_anh: {
          select: {
            hinh_id: true,
            ten_hinh: true,
            duong_dan: true,
            mo_ta: true,
            created_at: true
          },
          include: {
            nguoi_dung: {
              select: {
                nguoi_dung_id: true,
                ho_ten: true,
                anh_dai_dien: true
              }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' },
      skip,
      take: limit
    });

    const total = await prisma.luu_anh.count({
      where: { nguoi_dung_id: userId }
    });

    return {
      images: savedImages.map(item => item.hinh_anh),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
};
