import { RequestWithUser } from '@/dtos/request.dto';
import authMiddleware from '@/middlewares/auth.middleware';
import { requireRole } from '@/middlewares/role.middleware';
import UserService from '@/services/user.service';
import { Response } from 'express';
import {
  Get,
  JsonController,
  Req,
  Res,
  UseBefore,
} from 'routing-controllers';

@JsonController('/admin/user')
@UseBefore(requireRole('admin'))
@UseBefore(authMiddleware)
export default class UserController {
  private userService = new UserService();

  @Get('/profile')
  public async getProfileUser(@Req() req: RequestWithUser, @Res() res: Response) {
    const id = req.user._id.toString()
    return res.json({
      status: true,
      data: await this.userService.findById(id),
    });
  }
}
