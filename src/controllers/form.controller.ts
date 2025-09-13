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
} from 'routing-controllers';
import { createFormResponse, updateFormResponse } from '@/responses/form.response';
import { OpenAPI } from 'routing-controllers-openapi';

@JsonController('/form')
export default class FormController {
  private formService = new FormService();

  @Get('/')
  public async getAllForms(
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
      message: `Form for program ${createFormDto.program_id} created successfully`,
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
