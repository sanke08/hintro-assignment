import { useMutation } from "@tanstack/react-query";
import { updateList } from "../api/list.api";
import { queryClient } from "@/lib/queryClient";

export const useUpdateList = () => {
  return useMutation({
    mutationFn: updateList,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["board-lists", variables.boardId],
      });
    },
  });
};

