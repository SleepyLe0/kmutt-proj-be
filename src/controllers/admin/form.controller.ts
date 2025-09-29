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
  Req,
  Res,
  UseBefore,
} from 'routing-controllers';
import { createFormResponse, updateFormResponse } from '@/responses/form.response';
import { OpenAPI } from 'routing-controllers-openapi';
import { requireRole } from '@/middlewares/role.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import { RequestWithUser } from '@/dtos/request.dto';

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
    @QueryParam('faculty') faculty?: string,
    @QueryParam('department') department?: string,
    @QueryParam('program') program?: string,
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
      faculty,
      department,
      program,
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
    @Req() req: RequestWithUser,
    @Res() res: Response
  ) {
    const id = req.user._id.toString();
    const form = await this.formService.create(id, createFormDto);
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
    @Req() req: RequestWithUser,
    @Res() res: Response
  ) {
    const userId = req.user._id.toString();
    const form = await this.formService.update(id, userId, updateFormDto);
    return res.json({
      status: true,
      message: 'Form updated successfully',
      data: form,
    });
  }

  @Delete('/:id')
  public async deleteForm(@Param('id') id: string, @Req() req: RequestWithUser, @Res() res: Response) {
    const userId = req.user._id.toString();
    const result = await this.formService.delete(id, userId);
    return res.json({
      status: true,
      message: result
        ? 'Form deleted successfully'
        : 'Form not found',
    });
  }
}
