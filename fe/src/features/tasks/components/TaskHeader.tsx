import { Check, Loader2, Trash, Workflow, X } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateTask } from "../hooks/useUpdateTask";
import { useTrashTask } from "../hooks/useTrashTask";
import type { Task } from "@/lib/types";

type TaskHeaderProps = {
  task: Task;
  boardId: string;
  workspaceId: string;
  listId: string;
};

const TaskHeader = ({
  task,
  boardId,
  workspaceId,
  listId,
}: TaskHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [open, setOpen] = useState(false);

  const { mutateAsync: updateTask, isPending: updating } = useUpdateTask();
  const { mutateAsync: trashTask, isPending: deleting } = useTrashTask();

  const handleSave = async () => {
    if (!title.trim()) return;

    await updateTask({
      title,
      boardId,
      listId,
      taskId: task.id,
      workspaceId,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(task.title);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await trashTask({
      boardId,
      listId,
      taskId: task.id,
      workspaceId,
    });
    setOpen(false);
  };

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3 flex-1">
        <Workflow className="w-6 h-6 text-neutral-600 mt-1 shrink-0" />

        {isEditing ? (
          <div className="flex-1 flex items-center gap-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-semibold h-auto py-2"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSave}
              disabled={updating || !title.trim()}
              className="rounded-full"
            >
              {updating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              disabled={updating}
              className="rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <h1
            className="text-2xl font-semibold text-neutral-900 cursor-pointer hover:text-neutral-700 transition-colors flex-1"
            onClick={() => setIsEditing(true)}
          >
            {task.title}
          </h1>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={deleting}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            {deleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Trash className="w-4 h-4 mr-2" />
                Move to Trash
              </>
            )}
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this task?</DialogTitle>
            <DialogDescription>
              This will move the task to trash. You can restore it later.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              disabled={deleting}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              disabled={deleting}
              onClick={handleDelete}
            >
              {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskHeader;
