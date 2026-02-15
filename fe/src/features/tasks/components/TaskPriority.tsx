import { useState } from "react";
import { Flag, Check } from "lucide-react";
import type { Task, PRIORITY } from "@/lib/types";
import { useUpdateTask } from "../hooks/useUpdateTask";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type TaskPriorityProps = {
  task: Task;
  boardId: string;
  workspaceId: string;
  listId: string;
};

const priorityConfig = {
  LOW: {
    label: "Low",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    hoverColor: "hover:bg-green-100",
  },
  MEDIUM: {
    label: "Medium",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    hoverColor: "hover:bg-yellow-100",
  },
  HIGH: {
    label: "High",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    hoverColor: "hover:bg-orange-100",
  },
  URGENT: {
    label: "Urgent",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    hoverColor: "hover:bg-red-100",
  },
} as const;

const TaskPriority = ({
  task,
  boardId,
  workspaceId,
  listId,
}: TaskPriorityProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: updateTask, isPending } = useUpdateTask();

  const currentPriority = priorityConfig[task.priority];

  const handlePriorityChange = (priority: PRIORITY) => {
    updateTask({
      taskId: task.id,
      boardId,
      listId,
      workspaceId,
      priority,
    });
    setIsOpen(false);
  };

  return (
    <div>
      <label className="text-xs font-medium text-neutral-500 mb-2 block">
        Priority
      </label>

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            disabled={isPending}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors",
              currentPriority.bgColor,
              currentPriority.borderColor,
              currentPriority.hoverColor,
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <Flag className={cn("w-4 h-4", currentPriority.color)} />
            <span className={cn("text-sm font-medium", currentPriority.color)}>
              {currentPriority.label}
            </span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-48">
          {(Object.keys(priorityConfig) as PRIORITY[]).map((priority) => {
            const config = priorityConfig[priority];
            const isSelected = task.priority === priority;

            return (
              <DropdownMenuItem
                key={priority}
                onClick={() => handlePriorityChange(priority)}
                className="flex items-center gap-2"
              >
                <Flag className={cn("w-4 h-4", config.color)} />
                <span className="flex-1">{config.label}</span>
                {isSelected && <Check className="w-4 h-4 text-neutral-600" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TaskPriority;
