import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router: Router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", protect, authController.me);
router.get("/logout", protect, authController.logout);

export default router;
