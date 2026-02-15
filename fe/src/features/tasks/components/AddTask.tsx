import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useAddTask } from "../hooks/useAddTask";

const AddTask = ({
  listId,
  boardId,
  workspaceId,
}: {
  listId: string;
  boardId: string;
  workspaceId: string;
}) => {
  const { mutateAsync, isPending } = useAddTask();

  const onSubmit = async () => {
    try {
      await mutateAsync({ boardId, listId, workspaceId });
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  return (
    <Button
      onClick={() => onSubmit()}
      variant="ghost"
      className="w-full gap-2 border-t  cursor-pointer"
      isLoading={isPending}
      disabled={isPending}
    >
      <Plus size={16} />
      Add a task
    </Button>
  );
};

export default AddTask;
