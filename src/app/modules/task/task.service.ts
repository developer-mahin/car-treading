/* eslint-disable @typescript-eslint/no-explicit-any */
import sendNotification from '../../../socket/sendNotification';
import { TAuthUser } from '../../interface/authUser';
import AggregationQueryBuilder from '../../QueryBuilder/aggregationBuilder';
import generateTaskId from '../../utils/generateTaskId';
import { NOTIFICATION_TYPE } from '../notification/notification.interface';
import User from '../user/user.model';
import { TTask } from './task.interface';
import Task from './task.model';

const createTask = async (
  payload: Omit<TTask, 'taskStatus'> & { uuid?: string },
  user: TAuthUser,
) => {
  const findUser = await User.findOne({
    uuid: payload.uuid,
  });

  if (!findUser) {
    throw new Error('User not found');
  }

  const taskId = await generateTaskId();
  const task = new Task({ ...payload, assignTo: findUser._id, taskId });

  const notification = {
    senderId: user.userId || (user._id as any),
    receiverId: findUser._id,
    linkId: task._id as any,
    message: `A new task has been created for you.`,
    type: NOTIFICATION_TYPE.task,
    role: user.role,
    link: `/task/${task._id}`,
  };

  findUser.isTaskAssigned = true;
  await sendNotification(user, notification);
  await task.save();
  await findUser.save();
  return task;
};

const getTaskList = async (query: Record<string, unknown>) => {
  const taskQuery = new AggregationQueryBuilder(query);

  const result = await taskQuery
    .customPipeline([
      { $match: {} },

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
    ])
    .filter(['taskStatus'])
    .sort()
    .paginate()
    .execute(Task);

  const pagination = await taskQuery.countTotal(Task);
  return { pagination, result };
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

const getMyTasks = async (user: TAuthUser) => {
  const task = await Task.find({
    assignTo: user.userId || (user._id as any),
  });
  return task;
};

export const TaskService = {
  createTask,
  getTaskList,
  taskAction,
  getMyTasks,
};
