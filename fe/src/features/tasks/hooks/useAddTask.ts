import { useMutation } from "@tanstack/react-query";
import { createTask } from "../api/task.api";
import { queryClient } from "@/lib/queryClient";

export const useAddTask = () => {
  return useMutation({
    mutationFn: createTask,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["board-lists", variables.boardId],
      });
    },
  });
};

