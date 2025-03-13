import mongoose from 'mongoose';
import {
  TErrorSources,
  TGenericErrorResponse,
} from '../app/interface/IErrorSources';

export const handleCastError = (
  error: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: error.path,
      message: error.message,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: 'Invalid ID',
    errorSources,
  };
};
