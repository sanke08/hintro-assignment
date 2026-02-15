import { useQuery } from "@tanstack/react-query";
import { getTask } from "../api/task.api";
import type { Task } from "@/lib/types";

export const useGetTask = ({
  taskId,
  boardId,
  workspaceId,
  listId,
}: {
  taskId: string;
  boardId: string;
  workspaceId: string;
  listId: string;
}) => {
  return useQuery<Task>({
    queryKey: ["task", taskId],
    queryFn: () =>
      getTask({
        taskId,
        boardId,
        workspaceId,
        listId,
      }),
    enabled: !!taskId,
  });
};
