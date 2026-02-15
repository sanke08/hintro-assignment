import { useMutation } from "@tanstack/react-query";
import { createList } from "../api/list.api";
import { queryClient } from "@/lib/queryClient";

export const useAddList = () => {
  return useMutation({
    mutationFn: createList,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["board-lists", variables.boardId],
      });
    },
  });
};

