import { Router } from "express";
import * as boardController from "../controllers/board.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import listRouter from "./list.routes.js";

const router: Router = Router({ mergeParams: true });

router.use(protect);

router.get("/", boardController.getBoards);
router.get("/:boardId", boardController.getBoardDetails);
router.post("/", boardController.createBoard);
router.patch("/:boardId", boardController.updateBoard);
router.patch("/:boardId/trash", boardController.trashBoard);
router.patch("/:boardId/restore", boardController.restoreBoard);
router.delete("/:boardId", boardController.deleteBoard);

router.use("/:boardId/lists", listRouter);
export default router;
