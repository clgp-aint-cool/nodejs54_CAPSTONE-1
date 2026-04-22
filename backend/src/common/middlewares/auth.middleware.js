import jwt from 'jsonwebtoken';
import { prisma } from '../prisma/prisma-client.js';
import { ACCESS_TOKEN_SECRET } from '../constants/app.constant.js';
import { AppError } from '../helpers/app-error.helper.js';

export const authenticateToken = async (req, res, next) => {
    try {
        let accessToken = req.cookies?.accessToken;

        if (!accessToken && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            accessToken = req.headers.authorization.split(" ")[1];
        }

        if (!accessToken) {
            throw new AppError("Không có token", 401);
        }

        // kiểm tra token
        const decode = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);

        // kiểm tra người dùng có trong db hay không
        const userExits = await prisma.nguoi_dung.findUnique({
            where: { nguoi_dung_id: decode.userId }
        });

        if (!userExits) {
            throw new AppError("Người dùng không tồn tại", 401);
        }

        req.user = userExits;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            next(new AppError('Token đã hết hạn', 401));
        } else if (error.name === 'JsonWebTokenError') {
            next(new AppError('Token không hợp lệ', 401));
        } else if (error instanceof AppError) {
            next(error);
        } else {
            next(new AppError('Lỗi xác thực', 500));
        }
    }
};