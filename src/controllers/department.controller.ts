import DepartmentService from '@/services/department.service';
import { Response } from 'express';
import {
  Get,
  JsonController,
  Param,
  Res,
  UseBefore,
} from 'routing-controllers';
import authMiddleware from '@/middlewares/auth.middleware';

@JsonController('/department')
@UseBefore(authMiddleware)
export default class DepartmentController {
  private departmentService = new DepartmentService();

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
}
