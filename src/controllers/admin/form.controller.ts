import { paginationDto } from '@/dtos/pagination.dto';
import {
  CreateFormDto,
  UpdateFormDto,
} from '@/dtos/form.dto';
import FormService from '@/services/form.service';
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
import { createFormResponse, updateFormResponse } from '@/responses/form.response';
import { OpenAPI } from 'routing-controllers-openapi';
import { requireRole } from '@/middlewares/role.middleware';
import authMiddleware from '@/middlewares/auth.middleware';

@JsonController('/admin/form')
@UseBefore(requireRole('admin'))
@UseBefore(authMiddleware)
export default class FormController {
  private formService = new FormService();

  @Get('/')
  public async getAllForms(
    @Res() res: Response,
    @QueryParam('limit') limit: number = 20,
    @QueryParam('page') page: number = 1,
    @QueryParam('search') search?: string,
    @QueryParam('search_option') search_option?: string,
    @QueryParam('status') status?: string,
    @QueryParam('admission_id') admission_id?: string,
    @QueryParam('faculty_id') faculty_id?: string,
    @QueryParam('department_id') department_id?: string,
    @QueryParam('program_id') program_id?: string,
    @QueryParam('submitter_name') submitter_name?: string,
    @QueryParam('submitter_email') submitter_email?: string,
    @QueryParam('date_start') date_start?: string,
    @QueryParam('date_end') date_end?: string,
    @QueryParam('sort') sort?: number,
    @QueryParam('sort_option') sort_option?: string,
  ) {
    const paginationParams: paginationDto = {
      limit,
      page,
      skip: (page - 1) * limit,
      search,
      search_option,
      status,
      admission_id,
      faculty_id,
      department_id,
      program_id,
      submitter_name,
      submitter_email,
      date_start,
      date_end,
      sort,
      sort_option,
    };

    return res.json({
      status: true,
      ...(await this.formService.findAll(paginationParams)),
    });
  }

  @Get('/:id')
  public async getFormById(
    @Param('id') id: string,
    @Res() res: Response
  ) {
    const form = await this.formService.findById(id);
    return res.json({
      status: true,
      data: form,
    });
  }

  @Get('/admission/:admissionId')
  public async getFormsByAdmissionId(
    @Param('admissionId') admissionId: string,
    @Res() res: Response
  ) {
    const forms = await this.formService.findByAdmissionId(admissionId);
    return res.json({
      status: true,
      data: forms,
    });
  }

  @Get('/program/:programId')
  public async getFormsByProgramId(
    @Param('programId') programId: string,
    @Res() res: Response
  ) {
    const forms = await this.formService.findByProgramId(programId);
    return res.json({
      status: true,
      data: forms,
    });
  }

  @Get('/status/:status')
  public async getFormsByStatus(
    @Param('status') status: 'received' | 'verified',
    @Res() res: Response
  ) {
    const forms = await this.formService.findByStatus(status);
    return res.json({
      status: true,
      data: forms,
    });
  }

  @OpenAPI({
    requestBody: {
      required: true,
      content: {
        'application/json': {
          example: createFormResponse
        }
      }
    }
  })
  @Post('/')
  public async createForm(
    @Body() createFormDto: CreateFormDto,
    @Res() res: Response
  ) {
    const form = await this.formService.create(createFormDto);
    return res.json({
      status: true,
      message: `Form for admission ${createFormDto.admission_id} created successfully`,
      data: form,
    });
  }

  @OpenAPI({
    requestBody: {
      required: true,
      content: {
        'application/json': {
          example: updateFormResponse
        }
      }
    }
  })
  @Put('/:id')
  public async updateForm(
    @Param('id') id: string,
    @Body() updateFormDto: UpdateFormDto,
    @Res() res: Response
  ) {
    const form = await this.formService.update(id, updateFormDto);
    return res.json({
      status: true,
      message: 'Form updated successfully',
      data: form,
    });
  }

  @Put('/:id/status')
  public async updateFormStatus(
    @Param('id') id: string,
    @Body() body: { status: 'received' | 'verified' },
    @Res() res: Response
  ) {
    const form = await this.formService.updateStatus(id, body.status);
    return res.json({
      status: true,
      message: `Form status updated to ${body.status} successfully`,
      data: form,
    });
  }

  @Delete('/:id')
  public async deleteForm(@Param('id') id: string, @Res() res: Response) {
    const result = await this.formService.delete(id);
    return res.json({
      status: true,
      message: result
        ? 'Form deleted successfully'
        : 'Form not found',
    });
  }
}
