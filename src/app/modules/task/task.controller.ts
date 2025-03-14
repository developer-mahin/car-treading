import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { TaskService } from "./task.service";

const createTask = catchAsync(async (req, res) => {
    const task = await TaskService.createTask(req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Task created successfully',
        data: task,
    });
});

export const TaskController = {
    createTask
}