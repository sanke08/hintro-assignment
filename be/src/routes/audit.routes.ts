import { Router } from "express";
import * as auditController from "../controllers/audit.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router: Router = Router({ mergeParams: true });

router.use(protect);
router.get("/", auditController.getAudits);

export default router;
