import bcrypt from 'bcrypt';
import { prisma } from '../common/prisma/prisma-client.js';
import { tokenService } from "./token.service.js";
import { AppError } from '../common/helpers/app-error.helper.js';

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const authService = {
  register: async (email, password, ho_ten, tuoi) => {
    const existingUser = await prisma.nguoi_dung.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.nguoi_dung.create({
      data: {
        email,
        mat_khau: hashedPassword,
        ho_ten,
        tuoi: parseInt(tuoi)
      }
    });

    return {
      user: {
        nguoi_dung_id: user.nguoi_dung_id,
        email: user.email,
        ho_ten: user.ho_ten,
        tuoi: user.tuoi,
        anh_dai_dien: user.anh_dai_dien
      },
    };
  },

  login: async (email, password) => {
    const user = await prisma.nguoi_dung.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await comparePassword(password, user.mat_khau);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const accessToken = tokenService.createAccessToken(user.nguoi_dung_id);
    const refreshToken = tokenService.createRefreshToken(user.nguoi_dung_id);

    return {
      user: {
        nguoi_dung_id: user.nguoi_dung_id,
        email: user.email,
        ho_ten: user.ho_ten,
        tuoi: user.tuoi,
        anh_dai_dien: user.anh_dai_dien
      },
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  },

  refreshToken: async (accessToken, refreshToken) => {
    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }

    // Verify refresh token is valid
    const decodeRefreshToken = tokenService.verifyRefreshToken(refreshToken);

    // Get user to verify still exists
    const userExists = await prisma.nguoi_dung.findUnique({
      where: {
        nguoi_dung_id: decodeRefreshToken.userId,
      },
    });

    if (!userExists) {
      throw new Error('User no longer exists');
    }

    // Generate new tokens
    const accessTokenNew = tokenService.createAccessToken(userExists.nguoi_dung_id);
    const refreshTokenNew = tokenService.createRefreshToken(userExists.nguoi_dung_id);

    return {
      accessToken: accessTokenNew,
      refreshToken: refreshTokenNew,
    };
  }
};

