import { useMutation } from "@tanstack/react-query";
import { updateTask } from "../api/task.api";
import { queryClient } from "@/lib/queryClient";

export const useUpdateTask = () => {
  return useMutation({
    mutationFn: updateTask,
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["task", vars.taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["board-lists", vars.boardId],
      });
    },
  });
};
