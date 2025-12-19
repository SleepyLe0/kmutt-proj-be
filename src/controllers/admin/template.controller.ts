import { CreateTemplateDto, UpdateTemplateDto } from '@/dtos/template.dto';
import TemplateService from '@/services/template.service';
import { Response } from 'express';
import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  Res,
  UseBefore,
} from 'routing-controllers';
import { requireRole } from '@/middlewares/role.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import { OpenAPI } from 'routing-controllers-openapi';
import {
  createTemplateResponse,
  updateTemplateResponse,
} from '@/responses/template.response';

@JsonController('/admin/template')
@UseBefore(requireRole('admin'))
@UseBefore(authMiddleware)
export default class TemplateController {
  private templateService = new TemplateService();

  @Get('/')
  public async getAllTemplates(@Res() res: Response) {
    const templates = await this.templateService.findAll();
    return res.json({
      status: true,
      data: templates,
    });
  }

  @Get('/:id')
  public async getTemplateById(@Param('id') id: string, @Res() res: Response) {
    const template = await this.templateService.findById(id);
    return res.json({
      status: true,
      data: template,
    });
  }

  @OpenAPI({
    requestBody: {
      required: true,
      content: {
        'application/json': {
          example: createTemplateResponse,
        },
      },
    },
  })
  @Post('/')
  public async createTemplate(
    @Body() createTemplateDto: CreateTemplateDto,
    @Res() res: Response
  ) {
    const template = await this.templateService.create(createTemplateDto);
    return res.json({
      status: true,
      message: 'Template created successfully',
      data: template,
    });
  }

  @OpenAPI({
    requestBody: {
      required: true,
      content: {
        'application/json': {
          example: updateTemplateResponse,
        },
      },
    },
  })
  @Put('/:id')
  public async updateTemplate(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
    @Res() res: Response
  ) {
    const template = await this.templateService.update(id, updateTemplateDto);
    return res.json({
      status: true,
      message: 'Template updated successfully',
      data: template,
    });
  }

  @Delete('/:id')
  public async deleteTemplate(@Param('id') id: string, @Res() res: Response) {
    const result = await this.templateService.delete(id);
    return res.json({
      status: true,
      message: result ? 'Template deleted successfully' : 'Template not found',
    });
  }

  @Post('/:id/dup')
  public async dupTemplate(
    @Param('id') id: string,
    @Body() body: { title?: string },
    @Res() res: Response
  ) {
    const duplicated = await this.templateService.duplicate(id, body?.title);
    return res.json({
      status: true,
      message: 'Template duplicated successfully',
      data: duplicated,
    });
  }
}
