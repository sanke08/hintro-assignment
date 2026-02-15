import {
  type Request,
  type Response,
  type NextFunction,
  CookieOptions,
} from "express";
import { catchAsync } from "../utils/catchAsync.js";
import * as authService from "../services/auth.service.js";
import { registerSchema, loginSchema } from "../dtos/auth.dto.js";
import { AppError } from "../utils/appError.js";
import { createWorkspace } from "../services/workspace.service.js";

const createSendToken = (
  user: any,
  token: string,
  res: Response,
  statusCode: number,
) => {
  const cookieOptions: CookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  };

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    data: { user },
  });
};

export const register = catchAsync(async (req: Request, res: Response) => {
  const validation = registerSchema.safeParse(req.body);
  if (!validation.success) {
    const message = validation.error?.issues[0]?.message || "Validation error";
    throw new AppError(message, 400);
  }

  const { user, token } = await authService.register(validation.data);
  await createWorkspace({
    data: { name: "My Workspace" },
    userId: user.id,
  });
  createSendToken(user, token, res, 201);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) {
    const message = validation.error?.issues[0]?.message || "Validation error";
    throw new AppError(message, 400);
  }

  const { user, token } = await authService.login(validation.data);
  createSendToken(user, token, res, 200);
});

export const me = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id; // set by protect middleware

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { user } = await authService.findById(userId);

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  res.status(200).json({ data: user });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  res.cookie("jwt", "", { expires: new Date(0) });
  res.status(200).json({ message: "Logged out successfully" });
});
