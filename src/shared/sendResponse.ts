import { Response } from 'express';

type IApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string | null;
  meta?: {
    page?: number;
    limit?: number;
  } | null;
  data?: T | null | undefined;
  stack?: string | undefined;
};

const sendResponse = <T>(
  res: Response,
  data: IApiResponse<T>,
  page?: number,
  limit?: number
): void => {
  const responseData: IApiResponse<T> = {
    statusCode: data.statusCode,
    success: data.success,
    message: data.success ? data.message || null : 'Request failed',
    meta: page && limit ? { page, limit } : null,
    data: data.data || null,
    stack: data.stack,
  };

  res.status(data.statusCode).json(responseData);
};

export default sendResponse;
