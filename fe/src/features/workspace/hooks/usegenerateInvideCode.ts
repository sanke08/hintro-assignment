import { useMutation } from "@tanstack/react-query";
import { generateInviteLink } from "../api/workspace.api";
import { queryClient } from "@/lib/queryClient";

export const usegenerateInvideCode = ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  return useMutation({
    mutationFn: () => generateInviteLink({ workspaceId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId] });
    },
  });
};
