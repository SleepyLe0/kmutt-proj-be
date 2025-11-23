import { paginationDto } from '@/dtos/pagination.dto';
import { CreateAdmissionDto, UpdateAdmissionDto } from '@/dtos/admission.dto';
import AdmissionService from '@/services/admission.service';
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
  createAdmissionResponse,
  updateAdmissionResponse,
} from '@/responses/admission.response';
import { OpenAPI } from 'routing-controllers-openapi';
import { requireRole } from '@/middlewares/role.middleware';
import authMiddleware from '@/middlewares/auth.middleware';

@JsonController('/admin/admission')
@UseBefore(requireRole('admin'))
@UseBefore(authMiddleware)
export default class AdmissionController {
  private admissionService = new AdmissionService();

  @Get('/')
  public async getAllAdmissions(@Res() res: Response) {
    return res.json({
      status: true,
      ...(await this.admissionService.findAll()),
    });
  }

  @Get('/:id')
  public async getAdmissionById(@Param('id') id: string, @Res() res: Response) {
    const admission = await this.admissionService.findById(id);
    return res.json({
      status: true,
      data: admission,
    });
  }

  @Get('/active')
  public async getCurrentActiveAdmission(@Res() res: Response) {
    const admission = await this.admissionService.findCurrentActive();
    return res.json({
      status: true,
      data: admission,
    });
  }

  @OpenAPI({
    requestBody: {
      required: true,
      content: {
        'application/json': {
          example: createAdmissionResponse,
        },
      },
    },
  })
  @Post('/')
  public async createAdmission(
    @Body() createAdmissionDto: CreateAdmissionDto,
    @Res() res: Response
  ) {
    const admission = await this.admissionService.create(createAdmissionDto);
    return res.json({
      status: true,
      message: `Admission for ${createAdmissionDto.term.academic_year_th}/${createAdmissionDto.term.semester} created successfully`,
      data: admission,
    });
  }

  @OpenAPI({
    requestBody: {
      required: true,
      content: {
        'application/json': {
          example: updateAdmissionResponse,
        },
      },
    },
  })
  @Put('/:id')
  public async updateAdmission(
    @Param('id') id: string,
    @Body() updateAdmissionDto: UpdateAdmissionDto,
    @Res() res: Response
  ) {
    const admission = await this.admissionService.update(
      id,
      updateAdmissionDto
    );
    return res.json({
      status: true,
      message: 'Admission updated successfully',
      data: admission,
    });
  }

  @Put('/:id/toggle-active')
  public async toggleAdmissionActive(
    @Param('id') id: string,
    @Res() res: Response
  ) {
    const admission = await this.admissionService.toggleActive(id);
    return res.json({
      status: true,
      message: `Admission ${admission.active ? 'activated' : 'deactivated'} successfully`,
      data: admission,
    });
  }

  @Delete('/:id')
  public async deleteAdmission(@Param('id') id: string, @Res() res: Response) {
    const result = await this.admissionService.delete(id);
    return res.json({
      status: true,
      message: result
        ? 'Admission deleted successfully'
        : 'Admission not found',
    });
  }
}
