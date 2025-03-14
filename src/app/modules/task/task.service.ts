import generateTaskId from "../../utils/generateTaskId";
import { TTask } from "./task.interface";
import Task from "./task.model";

const createTask = async (payload: Omit<TTask, 'taskStatus'>) => {
    const taskId = await generateTaskId();
    const task = await Task.create({ ...payload, taskId });
    return task;
}

export const TaskService = {
    createTask
}