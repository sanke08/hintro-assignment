import { Router } from "express";
import * as listController from "../controllers/list.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import taskRoutes from "./task.routes.js";

const router: Router = Router({ mergeParams: true });

router.use(protect);

router.post("/", listController.createList);
router.patch("/:listId", listController.updateList);

router.post("/copy", listController.copy);
router.patch("/:listId/trash", listController.trash);
router.patch("/:listId/restore", listController.restore);
router.delete("/:listId", listController.deleteList);

router.use("/:listId/tasks", taskRoutes);

export default router;
