import AdmissionService from '@/services/admission.service';
import { Response } from 'express';
import { Get, JsonController, Res, UseBefore } from 'routing-controllers';
import authMiddleware from '@/middlewares/auth.middleware';

@JsonController('/admission')
@UseBefore(authMiddleware)
export default class AdmissionController {
  private admissionService = new AdmissionService();

  @Get('/active')
  public async getCurrentActiveAdmission(@Res() res: Response) {
    const admission = await this.admissionService.findCurrentActive();
    return res.json({
      status: true,
      data: admission,
    });
  }
  
  @Get('/')
  public async getAllAdmissions(@Res() res: Response) {
    return res.json({
      status: true,
      ...(await this.admissionService.findAll()),
    });
  }
}
