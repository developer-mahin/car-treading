import { model, Schema } from 'mongoose';
import { TTaskResolve } from './taskResolve.interface';

const taskResolveSchema = new Schema<TTaskResolve>(
  {
    taskId: { type: Schema.Types.ObjectId, required: true, ref: 'Task' },
    taskFile: { type: String },
    solutionDetails: {
      type: String,
      required: [true, 'Solution details is required'],
    },
  },
  {
    timestamps: true,
  },
);

export const TaskResolve = model('TaskResolve', taskResolveSchema);
export default TaskResolve;
