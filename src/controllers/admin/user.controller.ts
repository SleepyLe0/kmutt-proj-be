import { paginationDto } from '@/dtos/pagination.dto';
import { RequestWithUser } from '@/dtos/request.dto';
import { UpdateUserRoleDto } from '@/dtos/user.dto';
import authMiddleware from '@/middlewares/auth.middleware';
import { requireRole } from '@/middlewares/role.middleware';
import UserService from '@/services/user.service';
import { Response } from 'express';
import {
  Body,
  Get,
  JsonController,
  Param,
  Put,
  QueryParam,
  Req,
  Res,
  UseBefore,
} from 'routing-controllers';

@JsonController('/admin/user')
@UseBefore(requireRole('admin'))
@UseBefore(authMiddleware)
export default class UserController {
  private userService = new UserService();

  @Get('/')
  public async getAllUsers(
    @Res() res: Response,
    @QueryParam('limit') limit: number = 0,
    @QueryParam('page') page: number = 1,
    @QueryParam('name') name?: string
  ) {
    const paginationParams: paginationDto = {
      limit,
      page,
      skip: (page - 1) * limit,
    };

    return res.json({
      status: true,
      ...(await this.userService.findAll(paginationParams, name)),
    });
  }

  @Get('/:id')
  public async getUserById(@Param('id') id: string, @Res() res: Response) {
    const user = await this.userService.findById(id);
    return res.json({
      status: true,
      data: user,
    });
  }

  @Get('/profile')
  public async getProfileUser(
    @Req() req: RequestWithUser,
    @Res() res: Response
  ) {
    const id = req.user._id.toString();
    return res.json({
      status: true,
      data: await this.userService.findById(id),
    });
  }

  @Put('/role/:id')
  public async updateUserRole(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
    @Req() req: RequestWithUser,
    @Res() res: Response
  ) {
    const userId = req.user._id.toString();
    return res.json({
      status: true,
      data: await this.userService.updateRole(id, userId, updateUserRoleDto),
    });
  }
}
