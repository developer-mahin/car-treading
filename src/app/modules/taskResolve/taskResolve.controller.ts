import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TaskResolveService } from './taskResolve.service';

const resolveTask = catchAsync(async (req, res) => {
  req.body.taskFile = req.file?.path;
  const result = await TaskResolveService.resolveTask(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Task resolved successfully',
    data: result,
  });
});

export const TaskResolveController = {
  resolveTask,
};
