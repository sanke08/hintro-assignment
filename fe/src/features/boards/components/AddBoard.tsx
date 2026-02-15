import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateBoard } from "../hooks/useCreateBoard";
import {
  createBoardSchema,
  type CreateBoardInput,
} from "../schemas/board.schema";
import { Plus } from "lucide-react";

type Props = {
  workspaceId: string;
};

const AddBoardDialog = ({ workspaceId }: Props) => {
  const form = useForm<CreateBoardInput>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: { title: "" },
  });

  const { mutate, isPending, error } = useCreateBoard(workspaceId);

  const onSubmit = (values: CreateBoardInput) => {
    mutate(values.title, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger className="border rounded-lg shadow h-20 cursor-pointer">
        <Plus className="mx-auto" />
        Add Board
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Board</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Input
            placeholder="Board title"
            {...form.register("title")}
            disabled={isPending}
          />

          {form.formState.errors.title && (
            <p className="text-sm text-red-500">
              {form.formState.errors.title.message}
            </p>
          )}

          {error && (
            <p className="text-sm text-red-500">Something went wrong</p>
          )}
          <Button
            type="submit"
            isLoading={isPending}
            className="w-full cursor-pointer"
          >
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBoardDialog;
