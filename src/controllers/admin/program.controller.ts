import { paginationDto } from '@/dtos/pagination.dto';
import { CreateProgramDto, UpdateProgramDto } from '@/dtos/program.dto';
import ProgramService from '@/services/program.service';
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
import {
  createProgramResponse,
  updateProgramResponse,
} from '@/responses/program.response';
import { OpenAPI } from 'routing-controllers-openapi';
import authMiddleware from '@/middlewares/auth.middleware';
import { requireRole } from '@/middlewares/role.middleware';

@JsonController('/admin/program')
@UseBefore(requireRole('admin'))
@UseBefore(authMiddleware)
export default class ProgramController {
  private programService = new ProgramService();

  @Get('/')
  public async getAllPrograms(
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
      ...(await this.programService.findAll(paginationParams)),
    });
  }

  @Get('/active')
  public async getAllActivePrograms(
    @QueryParam('faculty_id') faculty_id: string,
    @QueryParam('department_id') department_id: string,
    @QueryParam('degree_level') degree_level: 'master' | 'doctoral',
    @Res() res: Response
  ) {
    const programs = await this.programService.findAllActiveForExport({
      faculty_id,
      department_id,
      degree_level,
    });

    return res.json({
      status: true,
      data: programs,
    });
  }

  @Get('/:id')
  public async getProgramById(@Param('id') id: string, @Res() res: Response) {
    const program = await this.programService.findById(id);
    return res.json({
      status: true,
      data: program,
    });
  }

  @Get('/faculty/:facultyId')
  public async getProgramsByFacultyId(
    @Param('facultyId') facultyId: string,
    @Res() res: Response
  ) {
    const programs = await this.programService.findByFacultyId(facultyId);
    return res.json({
      status: true,
      data: programs,
    });
  }

  @Get('/department/:departmentId')
  public async getProgramsByDepartmentId(
    @Param('departmentId') departmentId: string,
    @Res() res: Response
  ) {
    const programs =
      await this.programService.findByDepartmentIdAdmin(departmentId);
    return res.json({
      status: true,
      data: programs,
    });
  }

  @OpenAPI({
    requestBody: {
      required: true,
      content: {
        'application/json': {
          example: createProgramResponse,
        },
      },
    },
  })
  @Post('/')
  public async createProgram(
    @Body() createProgramDto: CreateProgramDto,
    @Res() res: Response
  ) {
    const program = await this.programService.create(createProgramDto);
    return res.json({
      status: true,
      message: `Program ${createProgramDto.title} created successfully`,
      data: program,
    });
  }

  @OpenAPI({
    requestBody: {
      required: true,
      content: {
        'application/json': {
          example: updateProgramResponse,
        },
      },
    },
  })
  @Put('/:id')
  public async updateProgram(
    @Param('id') id: string,
    @Body() updateProgramDto: UpdateProgramDto,
    @Res() res: Response
  ) {
    const program = await this.programService.update(id, updateProgramDto);
    return res.json({
      status: true,
      message: 'Program updated successfully',
      data: program,
    });
  }

  @Delete('/:id')
  public async deleteProgram(@Param('id') id: string, @Res() res: Response) {
    const result = await this.programService.delete(id);
    return res.json({
      status: true,
      message: result ? 'Program deleted successfully' : 'Program not found',
    });
  }

  @Put('/:id/toggle-active')
  public async toggleProgramActive(
    @Param('id') id: string,
    @Res() res: Response
  ) {
    const program = await this.programService.toggleActive(id);
    return res.json({
      status: true,
      message: program.active
        ? 'Program activated successfully'
        : 'Program deactivated successfully',
      data: program,
    });
  }
}
