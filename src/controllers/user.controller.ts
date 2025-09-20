import { paginationDto } from '@/dtos/pagination.dto';
import UserService from '@/services/user.service';
import { Response } from 'express';
import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  QueryParam,
  Res,
} from 'routing-controllers';

@JsonController('/user')
export default class UserController {
  private userService = new UserService();

  @Get('/')
  public async getAllUsers(
    @QueryParam('limit') limit: number = 0,
    @QueryParam('page') page: number = 1,
    @Res() res: Response
  ) {
    const paginationParams: paginationDto = {
      limit,
      page,
      skip: (page - 1) * limit,
    };

    return res.json({
      status: true,
      ...(await this.userService.findAll(paginationParams)),
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
}
