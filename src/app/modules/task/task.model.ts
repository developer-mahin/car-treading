import { model, Schema } from 'mongoose';
import { TTask } from './task.interface';

const taskSchema = new Schema<TTask>(
  {
    assignTo: {
      type: Schema.Types.ObjectId,
      required: [true, 'Assign to is required'],
      ref: 'User',
    },
    taskId: {
      type: String,
      required: [true, 'Task ID is required'],
      unique: true,
    },
    taskTitle: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    taskDescription: {
      type: String,
      required: [true, 'Task description is required'],
      trim: true,
    },
    taskStatus: {
      type: String,
      required: [true, 'Task status is required'],
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Task = model<TTask>('Task', taskSchema);

export default Task;
