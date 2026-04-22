import { Router } from 'express';
import authRouter from './auth.router.js';
import imageRouter from './image.router.js';
import userRouter from './user.router.js';
import commentRouter from './comment.router.js';
import savedRouter from './saved.router.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/images', imageRouter);
router.use('/users', userRouter);
router.use('/comments', commentRouter);
router.use('/saved', savedRouter);

export default router;
