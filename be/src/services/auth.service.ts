import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as userRepository from "../repositories/user.repository.js";
import { AppError } from "../utils/appError.js";
import { type RegisterInput, type LoginInput } from "../dtos/auth.dto.js";

const signToken = (id: string) => {
  return jwt.sign({ id }, (process.env.JWT_SECRET || "secret") as jwt.Secret, {
    expiresIn: (process.env.JWT_EXPIRES_IN || "90d") as any,
  });
};

export const register = async (input: RegisterInput) => {
  const existingUser = await userRepository.findUserByEmail(input.email);
  if (existingUser) {
    throw new AppError("Email already in use", 400);
  }

  const hashedPassword = await bcrypt.hash(input.password, 12);

  const newUser = await userRepository.createUser({
    ...input,
    password: hashedPassword,
  });

  const token = signToken(newUser.id);
  const { password, ...user } = newUser;

  return { user, token };
};

export const login = async (input: LoginInput) => {
  const user = await userRepository.findUserByEmail(input.email);
  if (!user || !(await bcrypt.compare(input.password, user.password))) {
    throw new AppError("Incorrect email or password", 401);
  }

  const token = signToken(user.id);
  const { password, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

export const findById = async (id: string) => {
  const user = await userRepository.findUserById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return { user };
};
