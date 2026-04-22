import jwt from "jsonwebtoken";
import { AppError } from "../common/helpers/app-error.helper.js";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../common/constants/app.constant.js";

export const tokenService = {
    createAccessToken(userId) {
        if (!userId) {
            throw new AppError("không có userId để tạo token");
        }

        // accessToken <=> AT (ghi tắt)
        const accessToken = jwt.sign({ userId: userId }, ACCESS_TOKEN_SECRET, { expiresIn: "5m" });

        return accessToken;
    },
    createRefreshToken(userId) {
        if (!userId) {
            throw new AppError("không có userId để tạo token");
        }

        // refreshToken <=> RT (ghi tắt)
        const refreshToken = jwt.sign({ userId: userId }, REFRESH_TOKEN_SECRET, { expiresIn: "1d" });

        return refreshToken;
    },

    verifyAccessToken(accessToken, option) {
        const decode = jwt.verify(accessToken, ACCESS_TOKEN_SECRET, option);
        return decode
    },
    verifyRefreshToken(refreshToken, option) {
        const decode = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, option);
        return decode
    },
};