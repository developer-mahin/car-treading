import { Router } from "express";
import { auth } from "../../middleware/auth";
import { USER_ROLE } from "../../constant";
import { TaskController } from "./task.controller";

const router = Router()

router.post("/create_task", auth(USER_ROLE.admin), TaskController.createTask)


export const TaskRoutes = router