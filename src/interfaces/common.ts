import { IGenericErrorMessage } from './error';

export type IGenericErrorResponse = {
  success: false;
  statusCode: number;
  message: string;
  errorType: string;
  errorMessages: IGenericErrorMessage[];
  stack?: string;
};
