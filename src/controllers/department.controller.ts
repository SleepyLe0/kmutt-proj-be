import { paginationDto } from '@/dtos/pagination.dto';
import {
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from '@/dtos/department.dto';
import DepartmentService from '@/services/department.service';
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
import { createDepartmentResponse, updateDepartmentResponse } from '@/responses/department.response';
import { OpenAPI } from 'routing-controllers-openapi';
import authMiddleware from '@/middlewares/auth.middleware';

@JsonController('/department')
@UseBefore(authMiddleware)
export default class DepartmentController {
  private departmentService = new DepartmentService();

  @Get('/')
  public async getAllDepartments(
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
      ...(await this.departmentService.findAll(paginationParams)),
    });
  }

  @Get('/:id')
  public async getDepartmentById(
    @Param('id') id: string,
    @Res() res: Response
  ) {
    const department = await this.departmentService.findById(id);
    return res.json({
      status: true,
      data: department,
    });
  }

  @Get('/faculty/:facultyId')
  public async getDepartmentsByFacultyId(
    @Param('facultyId') facultyId: string,
    @Res() res: Response
  ) {
    const departments = await this.departmentService.findByFacultyId(facultyId);
    return res.json({
      status: true,
      data: departments,
    });
  }

  @OpenAPI({
    requestBody: {
      required: true,
      content: {
        'application/json': {
          example: createDepartmentResponse
        }
      }
    }
  })
  @Post('/')
  public async createDepartment(
    @Body() createDepartmentDto: CreateDepartmentDto,
    @Res() res: Response
  ) {
    const department = await this.departmentService.create(createDepartmentDto);
    return res.json({
      status: true,
      message: `Department ${createDepartmentDto.title} created successfully`,
      data: department,
    });
  }

  @OpenAPI({
    requestBody: {
      required: true,
      content: {
        'application/json': {
          example: updateDepartmentResponse
        }
      }
    }
  })
  @Put('/:id')
  public async updateDepartment(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
    @Res() res: Response
  ) {
    const department = await this.departmentService.update(
      id,
      updateDepartmentDto
    );
    return res.json({
      status: true,
      message: 'Department updated successfully',
      data: department,
    });
  }

  @Delete('/:id')
  public async deleteDepartment(@Param('id') id: string, @Res() res: Response) {
    const result = await this.departmentService.delete(id);
    return res.json({
      status: true,
      message: result
        ? 'Department deleted successfully'
        : 'Department not found',
    });
  }
}
