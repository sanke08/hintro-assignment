import { Loader2, Workflow } from "lucide-react";

import { useGetTask } from "../hooks/useGetTask";
import TaskHeader from "./TaskHeader";
import TaskDescription from "./TaskDescription";
import TaskProperties from "./TaskProperties";
import TaskActivity from "./TaskActivity";

const TaskDetail = ({
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
  const { data: task, isLoading } = useGetTask({
    taskId,
    boardId,
    workspaceId,
    listId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-neutral-500">
        <Workflow className="w-12 h-12 mb-2" />
        <p className="text-lg">Task not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <TaskHeader
        task={task}
        boardId={boardId}
        workspaceId={workspaceId}
        listId={listId}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:min-w-max w-full">
        {/* Main Content - Left Side */}
        <div className=" space-y-6 md:col-span-2">
          <TaskDescription
            task={task}
            boardId={boardId}
            workspaceId={workspaceId}
            listId={listId}
          />

          <TaskActivity taskId={task.id} />
        </div>

        {/* Sidebar - Right Side */}
        <div className="col-span-1 md:min-w-60">
          <TaskProperties
            task={task}
            boardId={boardId}
            workspaceId={workspaceId}
            listId={listId}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
