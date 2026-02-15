import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { leaveWorkspace } from "../api/workspace.api";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryClient";

export const useLeaveWorkspace = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: leaveWorkspace,
    onSuccess: (_, variables) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: ["workspace", variables.workspaceId],
      });
      // Invalidate workspace list
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success("You have left the workspace");
      navigate("/workspaces");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to leave workspace");
    },
  });
};
