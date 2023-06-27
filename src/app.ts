/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import express, { Application, NextFunction, Response, Request } from 'express';

import cors from 'cors';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './app/routes';
import { OrderRoutes } from './app/modules/order/order.routes';
import cookieParser from 'cookie-parser';


const app: Application = express();

app.use(cookieParser());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  globalErrorHandler(error, req, res);
});

app.use('/api/v1/', router);
// app.use('/api/v1/orders', OrderRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API not found',
      },
    ],
  });
});

export default app;
