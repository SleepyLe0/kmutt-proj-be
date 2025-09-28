import { paginationDto } from '@/dtos/pagination.dto';
import { CreateFacultyDto, UpdateFacultyDto } from '@/dtos/faculty.dto';
import FacultyService from '@/services/faculty.service';
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
  UseBefore,
} from 'routing-controllers';
import { createFacultyResponse, updateFacultyResponse } from '@/responses/faculty.response';
import { OpenAPI } from 'routing-controllers-openapi';
import authMiddleware from '@/middlewares/auth.middleware';
import { requireRole } from '@/middlewares/role.middleware';

@JsonController('/admin/faculty')
@UseBefore(requireRole('admin'))
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

  @Get('/:id')
  public async getFacultyById(@Param('id') id: string, @Res() res: Response) {
    const faculty = await this.facultyService.findById(id);
    return res.json({
      status: true,
      data: faculty,
    });
  }

  @OpenAPI({
    requestBody: {
      required: true,
      content: {
        'application/json': {
          example: createFacultyResponse
        }
      }
    }
  })
  @Post('/')
  public async createFaculty(
    @Body() createFacultyDto: CreateFacultyDto,
    @Res() res: Response
  ) {
    const faculty = await this.facultyService.create(createFacultyDto);
    return res.json({
      status: true,
      message: `Faculty ${createFacultyDto.title} created successfully`,
      data: faculty,
    });
  }

  @OpenAPI({
    requestBody: {
      required: true,
      content: {
        'application/json': {
          example: updateFacultyResponse
        }
      }
    }
  })
  @Put('/:id')
  public async updateFaculty(
    @Param('id') id: string,
    @Body() updateFacultyDto: UpdateFacultyDto,
    @Res() res: Response
  ) {
    const faculty = await this.facultyService.update(id, updateFacultyDto);
    return res.json({
      status: true,
      message: 'Faculty updated successfully',
      data: faculty,
    });
  }

  @Delete('/:id')
  public async deleteFaculty(@Param('id') id: string, @Res() res: Response) {
    const result = await this.facultyService.delete(id);
    return res.json({
      status: true,
      message: result ? 'Faculty deleted successfully' : 'Faculty not found',
    });
  }
}
