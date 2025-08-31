import { paginationDto } from '@/dtos/pagination.dto';
import { CreateUserDto } from '@/dtos/user.dto';
import UserService from '@/services/user.service';
import { Response } from 'express';
import {
  Body,
  Get,
  JsonController,
  Post,
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

  @Post("/")
  public async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    await this.userService.create(createUserDto);
    return res.json({
      status: true,
      message: `Email ${createUserDto.email} have sign-up successfully`
    })
  }
}
