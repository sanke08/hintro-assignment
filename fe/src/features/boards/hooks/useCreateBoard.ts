import { useMutation } from "@tanstack/react-query";
import { createBoardApi } from "../api/boards.api";
import { queryClient } from "@/lib/queryClient";

export const useCreateBoard = (workspaceId: string) => {
  return useMutation({
    mutationFn: (title: string) => createBoardApi({ title, workspaceId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspace-boards", workspaceId],
      });
    },
  });
};
