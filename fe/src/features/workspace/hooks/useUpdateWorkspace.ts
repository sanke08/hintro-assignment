import { useMutation } from "@tanstack/react-query";
import { updateWorkspace } from "../api/workspace.api";
import { queryClient } from "@/lib/queryClient";

export const useUpdateWorkspace = () => {
  return useMutation({
    mutationFn: updateWorkspace,
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspace", vars.workspaceId],
      });
    },
  });
};
