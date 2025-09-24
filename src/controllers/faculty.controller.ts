import { paginationDto } from '@/dtos/pagination.dto';
import FacultyService from '@/services/faculty.service';
import { Response } from 'express';
import {
  Get,
  JsonController,
  QueryParam,
  Res,
  UseBefore,
} from 'routing-controllers';
import authMiddleware from '@/middlewares/auth.middleware';

@JsonController('/faculty')
@UseBefore(authMiddleware)
export default class FacultyController {
  private facultyService = new FacultyService();

  @Get('/')
  public async getAllFaculties(
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
      ...(await this.facultyService.findAll(paginationParams)),
    });
  }
}
