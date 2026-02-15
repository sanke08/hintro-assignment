import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/appError.js";
import * as userRepository from "../repositories/user.repository.js";

interface JwtPayload {
  id: string;
}

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies?.jwt;
    console.log({ token })

    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "secret"
      ) as JwtPayload;
      const currentUser = await userRepository.findUserById(decoded.id);
      if (!currentUser) {
        return next(
          new AppError(
            "The user belonging to this token no longer does exist.",
            401
          )
        );
      }

      req.user = currentUser;
      next();
    } catch (err) {
      return next(new AppError("Invalid Token", 401));
    }
  }
);
