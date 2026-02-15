import { api } from "@/lib/axios";
import type { Task } from "@/lib/types";

export const getMyTasks = async (params?: {
  search?: string;
  status?: string;
  priority?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<Task[]> => {
  const { data } = await api.get(`/workspaces/random/tasks`, { params });
  return data.data;
};
