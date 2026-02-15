import { type RegisterInput } from "../dtos/auth.dto.js";
import { db } from "../utils/db.js";

export const createUser = async (data: RegisterInput) => {
  return await db.user.create({
    data: { ...data, avatar: data.avatar || null },
  });
};

export const findUserByEmail = async (email: string) => {
  return await db.user.findUnique({
    where: { email },
  });
};

export const findUserById = async (id: string) => {
  return await db.user.findUnique({
    where: { id },
  });
};
