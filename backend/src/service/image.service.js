import { prisma } from '../common/prisma/prisma-client.js';

export const imageService = {
  getAllImages: async (page = 1, limit = 20, search = null) => {
    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { ten_hinh: { contains: search, mode: 'insensitive' } },
            { mo_ta: { contains: search, mode: 'insensitive' } }
          ]
        }
      : {};

    const images = await prisma.hinh_anh.findMany({
      where,
      include: {
        nguoi_dung: {
          select: {
            nguoi_dung_id: true,
            ho_ten: true,
            anh_dai_dien: true
          }
        },
        _count: {
          select: {
            binh_luan: true,
            luu_anh: true
          }
        }
      },
      orderBy: { created_at: 'desc' },
      skip,
      take: limit
    });

    const total = await prisma.hinh_anh.count({ where });

    return {
      images,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  },

  getImageById: async (imageId) => {
    const image = await prisma.hinh_anh.findUnique({
      where: { hinh_id: imageId },
      include: {
        nguoi_dung: {
          select: {
            nguoi_dung_id: true,
            ho_ten: true,
            anh_dai_dien: true
          }
        },
        binh_luan: {
          orderBy: { created_at: 'desc' },
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
      }
    });

    if (!image) {
      throw new Error('Image not found');
    }

    return image;
  },

  createImage: async (userId, ten_hinh, duong_dan, mo_ta = '') => {
    const image = await prisma.hinh_anh.create({
      data: {
        nguoi_dung_id: userId,
        ten_hinh,
        duong_dan,
        mo_ta
      },
      select: {
        hinh_id: true,
        ten_hinh: true,
        duong_dan: true,
        mo_ta: true,
        created_at: true,
        nguoi_dung: {
          select: {
            nguoi_dung_id: true,
            ho_ten: true,
            anh_dai_dien: true
          }
        }
      }
    });

    return image;
  },

  deleteImage: async (imageId, userId) => {
    const image = await prisma.hinh_anh.findFirst({
      where: {
        hinh_id: imageId,
        nguoi_dung_id: userId
      }
    });

    if (!image) {
      throw new Error('Image not found or you do not have permission to delete it');
    }

    await prisma.hinh_anh.delete({
      where: { hinh_id: imageId }
    });

    return { message: 'Image deleted successfully' };
  }
};
