import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export const useWorkspaceMembers = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const { data } = await api.get("/workspaces");
      return data.data;
    },
  });
};
