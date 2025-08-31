import { paginationDto } from '@/dtos/pagination.dto';
import { CreateUserDto } from '@/dtos/user.dto';
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

  @Post('/')
  public async createUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response
  ) {
    const user = await this.userService.create(createUserDto);
    return res.json({
      status: true,
      message: `Email ${createUserDto.email} have sign-up successfully`,
      data: user,
    });
  }

  @Put('/:id')
  public async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: any,
    @Res() res: Response
  ) {
    const user = await this.userService.update(id, updateUserDto);
    return res.json({
      status: true,
      message: 'User updated successfully',
      data: user,
    });
  }

  @Delete('/:id')
  public async deleteUser(@Param('id') id: string, @Res() res: Response) {
    const result = await this.userService.delete(id);
    return res.json({
      status: true,
      message: result ? 'User deleted successfully' : 'User not found',
    });
  }
}
