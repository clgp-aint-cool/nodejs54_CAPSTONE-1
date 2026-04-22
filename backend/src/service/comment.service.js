import { prisma } from '../common/prisma/prisma-client.js';

export const commentService = {
  getCommentsByImageId: async (imageId) => {
    const comments = await prisma.binh_luan.findMany({
      where: { hinh_id: imageId },
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
    });

    return comments;
  },

  addComment: async (userId, imageId, noi_dung) => {
    if (!noi_dung || noi_dung.trim() === '') {
      throw new Error('Comment content is required');
    }

    const image = await prisma.hinh_anh.findUnique({
      where: { hinh_id: imageId }
    });

    if (!image) {
      throw new Error('Image not found');
    }

    const comment = await prisma.binh_luan.create({
      data: {
        nguoi_dung_id: userId,
        hinh_id: imageId,
        noi_dung: noi_dung.trim()
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
    });

    return comment;
  },

  deleteComment: async (commentId, userId) => {
    const comment = await prisma.binh_luan.findFirst({
      where: {
        binh_luan_id: commentId,
        nguoi_dung_id: userId
      }
    });

    if (!comment) {
      throw new Error('Comment not found or you do not have permission to delete it');
    }

    await prisma.binh_luan.delete({
      where: { binh_luan_id: commentId }
    });

    return { message: 'Comment deleted successfully' };
  }
};
