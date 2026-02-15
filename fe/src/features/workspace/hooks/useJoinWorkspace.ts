import { useMutation } from "@tanstack/react-query";
import { joinWorkspace } from "../api/workspace.api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useJoinWorkspace = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: joinWorkspace,
    onSuccess: (data) => {
      navigate(`/${data.workspaceId}`);
      toast.success("Workspace joined successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to join workspace");
    },
  });
};
