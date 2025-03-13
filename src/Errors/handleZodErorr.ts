import { ZodError, ZodIssue } from 'zod';
import {
  TErrorSources,
  TGenericErrorResponse,
} from '../app/interface/IErrorSources';

const handleZodError = (error: ZodError): TGenericErrorResponse => {
  const errorSources: TErrorSources = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    };
  });

  const statusCode = 400;

  return {
    statusCode,
    message: 'validation error',
    errorSources,
  };
};

export default handleZodError;
