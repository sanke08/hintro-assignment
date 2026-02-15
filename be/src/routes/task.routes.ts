import * as taskController from "../controllers/task.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router: Router = Router({ mergeParams: true });

router.use(protect);

router.post("/", taskController.createTask);
router.get("/:taskId", taskController.getTask);
router.put("/:taskId", taskController.updateTask);
router.patch("/:taskId/trash", taskController.trashTask);
router.patch("/:taskId/restore", taskController.restoreTask);
router.delete("/:taskId", taskController.deleteTask);

export default router;
