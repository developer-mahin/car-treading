import httpStatus from 'http-status';
import { TAuthUser } from '../../interface/authUser';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TaskService } from './task.service';

const createTask = catchAsync(async (req, res) => {
  const task = await TaskService.createTask(req.body, req.user as TAuthUser);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Task created successfully',
    data: task,
  });
});

const getTaskList = catchAsync(async (req, res) => {
  const result = await TaskService.getTaskList(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Tasks fetched successfully',
    data: result,
  });
});

const taskAction = catchAsync(async (req, res) => {
  const { taskId } = req.params;
  const result = await TaskService.taskAction(taskId, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Task updated successfully',
    data: result,
  });
});

const getMyTasks = catchAsync(async (req, res) => {
  const user = req.user as TAuthUser;
  const result = await TaskService.getMyTasks(user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Tasks fetched successfully',
    data: result,
  });
});

export const TaskController = {
  createTask,
  getTaskList,
  taskAction,
  getMyTasks,
};
