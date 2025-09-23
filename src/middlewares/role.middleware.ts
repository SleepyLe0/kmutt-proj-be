import { ExpressMiddlewareInterface } from 'routing-controllers';
import { NextFunction, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { RequestWithUser } from '@/dtos/request.dto';

class RoleMiddleware implements ExpressMiddlewareInterface {
    private allowedRoles: string[];
    constructor(roles: string | string[]) {
        this.allowedRoles = Array.isArray(roles) ? roles : [roles];
    }

    async use(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            if (!req.user) throw new HttpException(401, 'Authentication required');
            if (!this.allowedRoles.includes(req.user.role)) {
                throw new HttpException(403, `Access denied. Required roles: ${this.allowedRoles.join(', ')}`);
            }
            next();
        } catch (error) {
            next(error);
        }
    }
}

// Middleware factory function
export const requireRole = (roles: string | string[]): ExpressMiddlewareInterface['use'] => {
    const middleware = new RoleMiddleware(roles);
    return middleware.use.bind(middleware);
};