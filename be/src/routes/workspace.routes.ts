import express, { type Router } from "express";
import * as workspaceController from "../controllers/workspace.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import memberRouter from "./member.routes.js";
import boardRouter from "./board.routes.js";
import auditRouter from "./audit.routes.js";
import { join } from "../controllers/member.controller.js";

const router: Router = express.Router();

router.use(protect); // All workspace routes need auth

// router.post("/join/:inviteLink", protect, workspaceController.joinWorkspace);

router
  .route("/")
  .get(workspaceController.getAll)
  .post(workspaceController.create);

router
  .route("/:workspaceId")
  .get(workspaceController.get)
  .patch(workspaceController.update)
  .delete(workspaceController.deleteWs);

router.route("/:workspaceId/trash").get(workspaceController.getTrash);
router.route("/:workspaceId/tasks").get(workspaceController.getTasks);
router
  .route("/invite/:inviteCode")
  .get(workspaceController.getWorkspaceByInviteCode);
router
  .route("/:workspaceId/generate-invite")
  .patch(workspaceController.generateInviteLink);

router.use("/:workspaceId/boards", boardRouter);
router.use("/:workspaceId/members", memberRouter);
router.use("/:workspaceId/audits", auditRouter);
router.post("/join", join); 

export default router; 
