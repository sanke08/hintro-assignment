import { Check, Loader2, Menu, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateTask } from "../hooks/useUpdateTask";
import { updateTaskSchema, type UpdateTaskInput } from "../schema/task.schema";
import type { Task } from "@/lib/types";

type TaskDescriptionProps = {
  task: Task;
  boardId: string;
  workspaceId: string;
  listId: string;
};

const TaskDescription = ({
  task,
  boardId,
  workspaceId,
  listId,
}: TaskDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { mutateAsync: updateTask, isPending: updating } = useUpdateTask();

  const form = useForm<UpdateTaskInput>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      description: task.description || "",
    },
  });

  const onSubmit = async (values: UpdateTaskInput) => {
    await updateTask({
      description: values.description || "",
      boardId,
      listId,
      taskId: task.id,
      workspaceId,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    form.reset({ description: task.description || "" });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Menu className="w-5 h-5 text-neutral-600" />
        <h3 className="text-lg font-semibold text-neutral-900">Description</h3>
      </div>

      {isEditing ? (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <Textarea
            {...form.register("description")}
            className="min-h-[120px] max-h-80 bg-neutral-50 focus:bg-white transition-colors"
            placeholder="Add a more detailed description..."
          />

          <div className="flex items-center gap-2">
            <Button
              type="submit"
              size="sm"
              disabled={updating}
              className="bg-green-600 hover:bg-green-700"
            >
              {updating ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Save
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              disabled={updating}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="min-h-[80px] p-4 bg-neutral-50 rounded-md cursor-pointer hover:bg-neutral-100 transition-colors"
        >
          {task.description ? (
            <p className="text-neutral-700 whitespace-pre-wrap">
              {task.description}
            </p>
          ) : (
            <p className="text-neutral-400 italic">
              Add a more detailed description...
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskDescription;
