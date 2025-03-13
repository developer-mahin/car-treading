/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  TErrorSources,
  TGenericErrorResponse,
} from '../app/interface/IErrorSources';

export const handleDuplicateError = (error: any): TGenericErrorResponse => {
  const match = error.message.match(/"([^"]*)"/);
  const message = match && match[1];

  const errorSources: TErrorSources = [
    {
      path: '',
      message: `${message} is already exists`,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: 'Duplicate error',
    errorSources,
  };
};
