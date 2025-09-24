import ProgramService from '@/services/program.service';
import { Response } from 'express';
import {
  Get,
  JsonController,
  Param,
  Res,
  UseBefore,
} from 'routing-controllers';
import authMiddleware from '@/middlewares/auth.middleware';

@JsonController('/program')
@UseBefore(authMiddleware)
export default class ProgramController {
  private programService = new ProgramService();

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
    const programs = await this.programService.findByDepartmentId(departmentId);
    return res.json({
      status: true,
      data: programs,
    });
  }
}