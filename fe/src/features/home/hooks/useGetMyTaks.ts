import { useQuery } from "@tanstack/react-query";
import { getMyTasks } from "../api/home.api";

export const useGetMyTasks = (params?: {
  search?: string;
  status?: string;
  priority?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  return useQuery({
    queryKey: ["my-tasks", params],
    queryFn: () => getMyTasks(params),
  });
};
