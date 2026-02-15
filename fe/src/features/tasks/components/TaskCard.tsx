import { useSearchParams } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";
import TaskDetail from "./TaskDetail";

type Props = {
  task: { id: string; title: string };
  index: number;

  boardId: string;
  workspaceId: string;
  listId: string;
};

const TaskCard = ({ task, boardId, workspaceId, listId }: Props) => {
  const [searchParams] = useSearchParams();
  const isHovered = searchParams.get("hover") === task.id;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={cn(
            "w-full p-2 px-4 rounded-lg shadow shadow-neutral-500/10 border bg-white cursor-pointer hover:border-black",
            isHovered && "bg-sky-200/80"
          )}
        >
          {task.title}
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-full w-fit  overflow-y-auto overflow-x-hidden max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Task Detail</DialogTitle>
        </DialogHeader>

        <TaskDetail
          taskId={task.id}
          boardId={boardId}
          workspaceId={workspaceId}
          listId={listId}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TaskCard;
