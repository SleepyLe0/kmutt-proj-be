import { NextFunction, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import userModel from '@/models/user.model';
import { verifyJWTAccess } from '@/utils/token';
import { User } from '@/interfaces/user.interface';
import { redisClient } from '@/helper/redisClient';
import { RequestWithUser } from '@/dtos/request.dto';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null) || req.cookies['Authorization'];
    if (!Authorization) throw new HttpException(401, 'Authentication token missing');
    const payload = verifyJWTAccess(Authorization) as { id: string, email: string };
    const cachedUser = await redisClient.get(`user:${payload.id}`) as string;
    let user = cachedUser ? JSON.parse(cachedUser) : null;
    if (!user) {
      const userDoc = await userModel.findById(payload.id);
      if (!userDoc) throw new HttpException(401, "User not found");
      user = userDoc.toObject() as User;
      await redisClient.set(`user:${payload.id}`, JSON.stringify(user), { EX: 300 });
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;