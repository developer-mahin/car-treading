import { Response } from 'express';

type TMeta = {
  limit: number;
  page: number;
  total: number;
  totalPage?: number;
};

type TResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  meta?: TMeta;
  data?: T;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data?.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    meta: data.meta,
    data: data.data,
  });
};

export default sendResponse;
