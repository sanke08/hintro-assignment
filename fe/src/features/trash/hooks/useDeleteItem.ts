import { useMutation } from "@tanstack/react-query";
import { deleteItemPermanently } from "../api/trash.api";
import { queryClient } from "@/lib/queryClient";

export const useDeleteItem = () => {
  return useMutation({
    mutationFn: deleteItemPermanently,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["trashed-items", variables.workspaceId],
      });
    },
  });
};
