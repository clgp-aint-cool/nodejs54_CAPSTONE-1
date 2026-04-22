import { prisma } from '../common/prisma/prisma-client.js';

export const userService = {
  getUserById: async (userId) => {
    const user = await prisma.nguoi_dung.findUnique({
      where: { nguoi_dung_id: userId },
      select: {
        nguoi_dung_id: true,
        email: true,
        ho_ten: true,
        tuoi: true,
        anh_dai_dien: true,
        hinh_anh: {
          orderBy: { created_at: 'desc' },
          select: {
            hinh_id: true,
            ten_hinh: true,
            duong_dan: true,
            mo_ta: true,
            created_at: true
          }
        }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  },

  updateUser: async (userId, data) => {
    const allowedFields = ['ho_ten', 'tuoi', 'anh_dai_dien'];

    const updateData = {};
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = field === 'tuoi' ? parseInt(data[field]) : data[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error('No valid fields to update');
    }

    const user = await prisma.nguoi_dung.update({
      where: { nguoi_dung_id: userId },
      data: updateData,
      select: {
        nguoi_dung_id: true,
        email: true,
        ho_ten: true,
        tuoi: true,
        anh_dai_dien: true
      }
    });

    return user;
  },

  getUserCreatedImages: async (userId, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;

    const images = await prisma.hinh_anh.findMany({
      where: { nguoi_dung_id: userId },
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
        },
        _count: {
          select: { binh_luan: true }
        }
      },
      orderBy: { created_at: 'desc' },
      skip,
      take: limit
    });

    const total = await prisma.hinh_anh.count({
      where: { nguoi_dung_id: userId }
    });

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

  getUserSavedImages: async (userId, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;

    const savedImages = await prisma.luu_anh.findMany({
      where: { nguoi_dung_id: userId },
      select: {
        hinh_anh: {
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
