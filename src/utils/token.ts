import { User } from "@/interfaces/user.interface";
import jwt from 'jsonwebtoken';

const accessSecret = process.env.JWT_ACCESS_SECRET!;
const refreshSecret = process.env.JWT_REFRESH_SECRET!;

export const generateJWTAccess = (user: User): string => {
  const jwtUser = { id: user._id, email: user.email, role: user.role };
  return jwt.sign(jwtUser, accessSecret, { expiresIn: '1d' });
}

export const generateJWTRefresh = (user: User): string => {
  const jwtUser = { id: user._id, email: user.email, role: user.role };
  return jwt.sign(jwtUser, refreshSecret, { expiresIn: '7d' });
}

export const verifyJWTAccess = (token: string): any => {
  return jwt.verify(token, accessSecret);
}

export const verifyJWTRefresh = (token: string): any => {
  return jwt.verify(token, refreshSecret);
}