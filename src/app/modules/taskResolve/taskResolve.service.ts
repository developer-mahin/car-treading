import TaskResolve from './taskResolve.model';

const resolveTask = async (payload: {
  taskId: string;
  taskFile: string;
  solutionDetails: string;
}) => {
  const result = await TaskResolve.create({
    ...payload,
  });

  return result;
};

export const TaskResolveService = {
  resolveTask,
};
