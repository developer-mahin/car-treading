/* eslint-disable @typescript-eslint/no-explicit-any */
import sendNotification from '../../../socket/sendNotification';
import { TAuthUser } from '../../interface/authUser';
import generateTaskId from '../../utils/generateTaskId';
import { NOTIFICATION_TYPE } from '../notification/notification.interface';
import User from '../user/user.model';
import { TTask } from './task.interface';
import Task from './task.model';

const createTask = async (
  payload: Omit<TTask, 'taskStatus'>,
  user: TAuthUser,
) => {
  const taskId = await generateTaskId();
  const task = new Task({ ...payload, taskId });

  console.log(user, 'user');
  const notification = {
    senderId: user.userId || (user._id as any),
    receiverId: payload.assignTo,
    linkId: task._id as any,
    message: `A new task has been created for you.`,
    type: NOTIFICATION_TYPE.task,
    role: user.role,
  };

  console.log(notification, 'notification');

  const findUser = await User.findById(payload.assignTo);
  if (!findUser) {
    throw new Error('User not found');
  }

  findUser.isTaskAssigned = true;
  await sendNotification(user, notification);
  await task.save();
  await findUser.save();
  return task;
};

const getTaskList = async (query: Record<string, unknown>) => {
  // const cacheKey = 'taskList';
  // const cachedProfile = await getCachedData<any[]>(cacheKey);

  // if (cachedProfile) {
  //   return cachedProfile;
  // }

  const result = await Task.aggregate([
    { $match: { ...query } },

    {
      $lookup: {
        from: 'users',
        localField: 'assignTo',
        foreignField: '_id',
        as: 'assignTo',
      },
    },

    {
      $unwind: '$assignTo',
    },

    {
      $lookup: {
        from: 'profiles',
        localField: 'assignTo.profile',
        foreignField: '_id',
        as: 'profile',
      },
    },

    {
      $unwind: '$profile',
    },

    {
      $lookup: {
        from: 'taskresolves',
        localField: '_id',
        foreignField: 'taskId',
        as: 'taskResolve',
      },
    },

    {
      $project: {
        taskId: 1,
        taskFile: 1,
        solutionDetails: 1,
        dealerInfo: {
          first_name: '$profile.first_name',
          last_name: '$profile.last_name',
          accountStatus: '$assignTo.status',
        },
        taskDescription: 1,
        deadline: 1,
        taskStatus: 1,
        taskResolve: 1,
      },
    },
  ]);

  // await cacheData(cacheKey, result, 900);

  return result;
};

const taskAction = async (taskId: string, payload: { taskStatus: string }) => {
  const result = await Task.findByIdAndUpdate(
    taskId,
    { $set: { taskStatus: payload.taskStatus } },
    { new: true },
  );
  if (!result) {
    throw new Error('Task not found');
  }

  const updateUser = await User.findById(result?.assignTo);
  if (!updateUser) {
    throw new Error('User not found');
  }

  updateUser.isTaskAssigned = false;
  await updateUser.save();

  return result;
};

export const TaskService = {
  createTask,
  getTaskList,
  taskAction,
};
