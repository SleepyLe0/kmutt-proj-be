import ConvertService from '@/services/convert.service';
import { Request, Response, NextFunction } from 'express';
import {
  JsonController,
  Post,
  Req,
  Res,
  UseBefore,
} from 'routing-controllers';
import authMiddleware from '@/middlewares/auth.middleware';
import { OpenAPI } from 'routing-controllers-openapi';
import { excelToPdfResponse } from '@/responses/convert.response';
import { HttpException } from '@/exceptions/HttpException';
import multer from 'multer';

// Extend Request interface
interface RequestWithFile extends Request {
  file?: Express.Multer.File;
}

// Configure multer middleware
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req: any, file: Express.Multer.File, cb: any) => {
    const allowedExtensions = ['.xlsx', '.xls'];
    const ext = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'));

    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only .xlsx and .xls files are allowed'), false);
    }
  },
});

// Wrap multer middleware to handle errors properly
const uploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const multerSingle = upload.single('file');
  multerSingle(req, res, (err: any) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new HttpException(400, 'File too large. Maximum size is 10MB'));
        }
        return next(new HttpException(400, err.message));
      }
      return next(new HttpException(400, err.message || 'File upload failed'));
    }
    next();
  });
};

@JsonController('/convert')
@UseBefore(authMiddleware)
export default class ConvertController {
  private convertService = new ConvertService();

  @OpenAPI({
    summary: 'Convert Excel file to PDF',
    description: 'Upload an Excel file (.xlsx or .xls) and receive a PDF buffer',
    requestBody: {
      required: true,
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              file: {
                type: 'string',
                format: 'binary',
                description: 'Excel file to convert (.xlsx or .xls, max 10MB)',
              },
            },
            required: ['file'],
          },
        },
      },
    },
    responses: {
      '200': {
        description: 'Excel file successfully converted to PDF',
        content: {
          'application/json': {
            example: {
              status: true,
              message: 'Excel file converted to PDF successfully',
              data: excelToPdfResponse,
            },
          },
        },
      },
      '400': {
        description: 'Invalid file type or file too large',
      },
      '401': {
        description: 'Authentication required',
      },
      '500': {
        description: 'Conversion failed',
      },
    },
  })
  @Post('/excel-to-pdf')
  @UseBefore(uploadMiddleware)
  public async convertExcelToPdf(
    @Req() req: RequestWithFile,
    @Res() res: Response
  ) {
    const file = req.file;

    console.log('File received:', {
      exists: !!file,
      originalname: file?.originalname,
      mimetype: file?.mimetype,
      size: file?.size,
      bufferLength: file?.buffer?.length
    });

    if (!file) {
      throw new HttpException(400, 'No file uploaded. Please provide an Excel file');
    }

    if (!file.buffer || file.buffer.length === 0) {
      throw new HttpException(400, 'File buffer is empty. Please upload a valid Excel file');
    }

    const result = await this.convertService.excelToPdf(
      file.buffer,
      file.originalname
    );

    return res.json({
      status: true,
      message: 'Excel file converted to PDF successfully',
      data: result,
    });
  }
}
