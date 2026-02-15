// src/features/members/hooks/useChangeRole.ts
import { useMutation } from "@tanstack/react-query";
import { changeRole } from "../api/member.api";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryClient";

export const useChangeRole = () => {
  return useMutation({
    mutationFn: changeRole,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", variables.workspaceId],
      });
      toast.success("Member role updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update member role"
      );
    },
  });
};
