// features/organization/hooks/useCreateOrganization.ts
import { useMutation } from "@tanstack/react-query";
import { createWorkspace } from "../api/workspace.api";
import { queryClient } from "@/lib/queryClient";

export const useCreateWorkspace = () => {
  return useMutation({
    mutationFn: createWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
};
