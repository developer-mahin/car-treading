import { ObjectId } from 'mongoose';

export type TTaskResolve = {
  taskId: ObjectId;
  taskFile: string;
  solutionDetails: string;
};
