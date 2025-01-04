import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { PdfService } from './pdf.service';
const generatePdf = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const pdf = await PdfService.generatePdfStream(id, res);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'PDF generated successfully',
    data: { pdf },
  });
});

export const PdfController = {
  generatePdf,
};
