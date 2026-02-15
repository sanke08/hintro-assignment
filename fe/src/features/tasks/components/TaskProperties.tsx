import type { Task } from "@/lib/types";
import TaskPriority from "./TaskPriority";
import TaskDueDate from "./TaskDueDate";
import TaskAssignee from "./TaskAssignee";
import TaskAssignedBy from "./TaskAssignedBy";
import TaskStatus from "./TaskStatus";
import { Separator } from "@/components/ui/separator";

type TaskPropertiesProps = {
  task: Task;
  boardId: string;
  workspaceId: string;
  listId: string;
};

const TaskProperties = ({
  task,
  boardId,
  workspaceId,
  listId,
}: TaskPropertiesProps) => {
  return (
    <div className="rounded-lg border border-neutral-200 p-6 py-4 w-full">
      <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide pb-2">
        Details
      </h3>

      <div className="space-y-2">
        <TaskStatus
          task={task}
          boardId={boardId}
          workspaceId={workspaceId}
          listId={listId}
        />

        <TaskPriority
          task={task}
          boardId={boardId}
          workspaceId={workspaceId}
          listId={listId}
        />

        <TaskDueDate
          task={task}
          boardId={boardId}
          workspaceId={workspaceId}
          listId={listId}
        />

        <Separator className="bg-neutral-300" />

        <TaskAssignee
          task={task}
          boardId={boardId}
          workspaceId={workspaceId}
          listId={listId}
        />

        <TaskAssignedBy
          task={task}
          boardId={boardId}
          workspaceId={workspaceId}
          listId={listId}
        />
      </div>
    </div>
  );
};

export default TaskProperties;
