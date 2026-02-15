import { User } from "../../prisma/generated/prisma/client.js";

declare global {
  namespace Express {
    interface Request {
      user: User; // Ideally we should type the user here
    }
  }
}
