import { Check, Circle, CircleDashed, CircleDot, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdateTask } from "../hooks/useUpdateTask";
import type { STATUS, Task } from "@/lib/types";

type TaskStatusProps = {
  task: Task;
  boardId: string;
  workspaceId: string;
  listId: string;
};

const statusConfig = {
  TO_DO: {
    label: "To Do",
    icon: Circle,
    color: "text-neutral-500",
    bgColor: "bg-neutral-100",
  },
  IN_PROGRESS: {
    label: "In Progress",
    icon: CircleDashed,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  IN_REVIEW: {
    label: "In Review",
    icon: CircleDot,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  DONE: {
    label: "Done",
    icon: Check,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
};

const TaskStatus = ({
  task,
  boardId,
  workspaceId,
  listId,
}: TaskStatusProps) => {
  const [open, setOpen] = useState(false);
  const { mutateAsync: updateTask, isPending } = useUpdateTask();

  const currentStatus = statusConfig[task.status as keyof typeof statusConfig];
  const StatusIcon = currentStatus?.icon;

  const handleStatusChange = async (status: STATUS) => {
    await updateTask({
      status,
      boardId,
      listId,
      taskId: task.id,
      workspaceId,
    });
    setOpen(false);
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-neutral-700">Status</span>

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={isPending}
            className={`${currentStatus?.bgColor} ${currentStatus?.color} hover:opacity-80`}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : StatusIcon ? (
              <StatusIcon className="w-4 h-4 mr-2" />
            ) : null}
            {currentStatus?.label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {Object.entries(statusConfig).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <DropdownMenuItem
                key={key}
                onClick={() => handleStatusChange(key as STATUS)}
                className="cursor-pointer"
              >
                <Icon className={`w-4 h-4 mr-2 ${config?.color}`} />
                <span>{config?.label}</span>
                {task?.status === key && (
                  <Check className="w-4 h-4 ml-auto text-green-600" />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TaskStatus;
