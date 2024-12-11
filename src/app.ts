import cors from 'cors';
import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './routes';
import { Morgan } from './shared/morgen';

const app = express();

//morgan
app.use(Morgan.successHandler);
app.use(Morgan.errorHandler);

//body parser
app.use(
  cors({
    origin: '*',
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//file retrieve
app.use('/stepImage', express.static('uploads/stepImage'));
app.use('/images', express.static('uploads/images'));
app.use('/profiles', express.static('uploads/profiles'));
app.use('/inspectionImages', express.static('uploads/inspectionImages'));
app.use('/medias', express.static('uploads/medias'));
app.use('/pdfReports', express.static('uploads/pdfReports'));
app.use('/docs', express.static('uploads/docs'));

//router
app.use('/api/v1', router);

//live response
app.get('/', (req: Request, res: Response) => {
  res.send(
    '<h1 style="text-align:center; color:#A55FEF; font-family:Verdana;">Hey, How can I assist you today!</h1>'
  );
});

//global error handle
app.use(globalErrorHandler);

//handle not found route;
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: 'Not found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API DOESN'T EXIST",
      },
    ],
  });
});

export default app;
