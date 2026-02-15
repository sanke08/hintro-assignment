import { useMutation } from "@tanstack/react-query";
import { removeMember } from "../api/member.api";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryClient";

export const useRemoveMember = () => {
  return useMutation({
    mutationFn: removeMember,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", variables.workspaceId],
      });
      toast.success("Member removed successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to remove member");
    },
  });
};
