import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../../constant';
import { TaskController } from './task.controller';

const router = Router();

router
  .post('/create_task', auth(USER_ROLE.admin), TaskController.createTask)
  .get('/task_list', auth(USER_ROLE.admin), TaskController.getTaskList)
  .get('/my_tasks', auth(USER_ROLE.dealer), TaskController.getMyTasks)
  .patch(
    '/mark_complete/:taskId',
    auth(USER_ROLE.admin),
    TaskController.taskAction,
  );

export const TaskRoutes = router;
