// src/features/workspaces/hooks/useDeleteWorkspace.ts
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { deleteWorkspace } from "../api/workspace.api";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryClient";

export const useDeleteWorkspace = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: deleteWorkspace,
    onSuccess: (_, variables) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: ["workspace", variables.workspaceId],
      });
      // Invalidate workspace list
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success("Workspace deleted successfully");
      navigate("/workspaces");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete workspace"
      );
    },
  });
};
