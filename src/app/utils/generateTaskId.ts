import Task from '../modules/task/task.model';

async function generateTaskId() {
  try {
    let newTaskId = '';
    const lastTaskId = await Task.findOne().sort({ createdAt: -1 }).exec();

    if (lastTaskId && lastTaskId.taskId) {
      const lastNumber = parseInt(lastTaskId.taskId);
      const newNumber = (lastNumber + 1).toString().padStart(5, '0');
      newTaskId = newNumber;
    } else {
      newTaskId = '00001';
    }

    // Generate the custom ID
    const customID = newTaskId;
    return customID;
  } catch (err) {
    console.error('Error generating custom ID:', err);
    throw new Error('Failed to generate custom ID');
  }
}

export default generateTaskId;
