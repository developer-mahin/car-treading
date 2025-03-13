import mongoose from 'mongoose';
import {
  TErrorSources,
  TGenericErrorResponse,
} from '../app/interface/IErrorSources';

export const handleValidationError = (
  error: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const errorSources: TErrorSources = Object.values(error.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      if (val instanceof mongoose.Error.CastError) {
        return {
          path: val.path,
          message: val.message,
        };
      } else {
        return {
          path: val.path,
          message: val.message,
        };
      }
    },
  );

  const statusCode = 400;
  return {
    statusCode,
    message: 'validation error',
    errorSources,
  };
};
