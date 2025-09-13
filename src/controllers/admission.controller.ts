import { paginationDto } from '@/dtos/pagination.dto';
import {
  CreateAdmissionDto,
  UpdateAdmissionDto,
} from '@/dtos/admission.dto';
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
} from 'routing-controllers';

@JsonController('/admission')
export default class AdmissionController {
  private admissionService = new AdmissionService();

  @Get('/')
  public async getAllAdmissions(
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
      ...(await this.admissionService.findAll(paginationParams)),
    });
  }

  @Get('/:id')
  public async getAdmissionById(
    @Param('id') id: string,
    @Res() res: Response
  ) {
    const admission = await this.admissionService.findById(id);
    return res.json({
      status: true,
      data: admission,
    });
  }

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
