import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../../constant';
import { TaskResolveController } from './taskResolve.controller';
import uploadDocument from '../../utils/uploadDocument';
import parseFormData from '../../middleware/parsedData';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.dealer),
  uploadDocument.single('taskFile'),
  parseFormData,
  TaskResolveController.resolveTask,
);

export const TaskResolveRoutes = router;
