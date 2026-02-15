import { api } from "@/lib/axios";

export const login = (data: { email: string; password: string }) =>
  api.post("/auth/login", data);

export const register = (data: {
  name: string;
  email: string;
  password: string;
}) => api.post("/auth/register", data);

export const getMe = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};
