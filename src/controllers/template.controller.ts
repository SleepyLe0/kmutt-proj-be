import TemplateService from '@/services/template.service';
import { Response } from 'express';
import {
  Get,
  JsonController,
  Param,
  Res,
  UseBefore,
} from 'routing-controllers';
import authMiddleware from '@/middlewares/auth.middleware';

@JsonController('/template')
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
}
