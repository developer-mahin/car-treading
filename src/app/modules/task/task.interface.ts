import { ObjectId } from 'mongoose';

export type TTask = {
  taskId: string;
  assignTo: ObjectId;
  taskTitle: string;
  taskDescription: string;
  taskStatus: 'pending' | 'completed';
  deadline: Date;
  // uuid: string;
};
