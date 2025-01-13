import express from 'express';
import puppeteer from 'puppeteer';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Inspection } from '../inspection/inspection.model';

export const generatePdfStream = async (id: string, res: express.Response) => {
  let browser = null;
  
  try {
    const inspection = await Inspection.findById(id).populate('product customer');
    if (!inspection) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Inspection not found');
    }

    const totalQuestions = inspection.step.reduce(
      (total, current) => total + current.answers.length,
      0
    );

    // Create question groups for pagination
    const questionsPerPage = 12;
    const questions = inspection.step.flatMap(step =>
      step.answers.map(answer => ({
        question: answer.question,
        status: answer.isYes ? 'YES' : 'NO',
        comment: answer.comment,
      }))
    );

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @page {
            size: A4;
            margin: 0;
        }
        body {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            box-sizing: border-box;
        }
        .page {
            page-break-before: always;
            position: relative;
            height: 297mm;
            padding: 40px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .page:first-of-type {
            page-break-before: auto;
        }
        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 200px;
            color: rgba(239, 239, 239, 0.8);
            white-space: nowrap;
            z-index: -1;
            font-weight: bold;
            font-family: Arial, sans-serif;
            pointer-events: none;
            letter-spacing: -5px;
            width: 100%;
            text-align: center;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #1a237e;
            margin-bottom: 30px;
            font-family: Arial, sans-serif;
        }
        .title {
            font-size: 20px;
            margin-bottom: 25px;
            font-weight: normal;
            margin-left: 320px;
            margin-top: -55px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0;
            margin-bottom: 25px;
            width: 100%;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
        }
        th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: white;
            font-weight: normal;
        }
        .footer {
            margin-top: 25px;
            line-height: 1.6;
        }
        .approved {
            color: green;
            font-weight: normal;
        }
        p {
            margin: 0;
            line-height: 1.6;
        }
        .content-wrapper {
            max-width: 700px;
            margin: 0 auto;
        }
        .page-number {
            position: absolute;
            bottom: 20px;
            right: 20px;
            font-size: 12px;
        }
    </style>
</head>
<body>
    ${generatePages(questions, questionsPerPage, inspection)}
</body>
</html>`;

    // Launch Puppeteer with proper Linux configuration
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // Set viewport for consistent rendering
    await page.setViewport({
      width: 794,  // A4 width in pixels at 96 DPI
      height: 1123,  // A4 height in pixels at 96 DPI
      deviceScaleFactor: 1,
    });

    await page.setContent(htmlContent, {
      waitUntil: ['domcontentloaded', 'networkidle0']
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
      preferCSSPageSize: true
    });

    // Set proper headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="inspection-report-${Date.now()}.pdf"`
    );
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    // Send the PDF
    res.end(pdfBuffer);

  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to generate PDF'
    );
  } finally {
    // Always close the browser
    if (browser) {
      await browser.close().catch(console.error);
    }
  }
};

function generatePages(
  questions: any[],
  questionsPerPage: number,
  inspection: any
) {
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  let pagesHtml = '';

  for (let pageNum = 0; pageNum < totalPages; pageNum++) {
    const startIdx = pageNum * questionsPerPage;
    const pageQuestions = questions.slice(
      startIdx,
      startIdx + questionsPerPage
    );
    const isFirstPage = pageNum === 0;

    pagesHtml += `
    <div class="page">
        <div class="watermark">FREMST</div>
        <div class="content-wrapper">
            ${generateHeader(inspection)}
            
            <table>
                <thead>
                    <tr>
                        <th>Control Points</th>
                        <th>OK</th>
                        <th>Comments</th>
                    </tr>
                </thead>
                <tbody>
                    ${pageQuestions
                      .map(
                        q => `
                        <tr>
                            <td>${q.question}</td>
                            <td>${q.status}</td>
                            <td>${q.comment}</td>
                        </tr>
                    `
                      )
                      .join('')}
                </tbody>
            </table>

            ${generateFooter(inspection)}
            <div class="page-number">Page ${pageNum + 1} of ${totalPages}</div>
        </div>
    </div>`;
  }

  return pagesHtml;
}

function generateHeader(inspection: any) {
  return `
    <div class="logo">FREMST</div>
    <div class="title">Inspection report - ${inspection.brand}</div>
    
    <div class="info-grid">
        <div>
            <p>Customer: ${inspection.customer.companyName}</p>
            <p>Employee: ${inspection.username}</p>
            <p>Date: ${new Date(inspection.lastInspectionDate).toLocaleDateString()}</p>
        </div>
        <div>
            <p>Protocol ID: ${inspection.protocolId}</p>
            <p>Product name: ${inspection.product.name}</p>
            <p>Product SKU: ${inspection.sku}</p>
            <p>Storage Location: ${inspection.storageLocation}</p>
            <p>Product brand: ${inspection.brand}</p>
        </div>
    </div>`;
}

function generateFooter(inspection: any) {
  return `
    <div class="footer">
        <p>The equipment is <span class="approved" style="color: ${
          inspection.isApproved ? 'green' : 'red'
        };">${inspection.isApproved ? 'approved' : 'not approved'}</span> as fall protection equipment</p>
        <p>The next inspection should take place on ${new Date(
          inspection.nextInspectionDate
        ).toLocaleDateString()}</p>
        <p>Inspection date & place: ${new Date(
          inspection.lastInspectionDate
        ).toLocaleDateString()}</p>
    </div>`;
}

export const PdfService = {
  generatePdfStream,
};