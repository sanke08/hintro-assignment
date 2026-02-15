import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createWorkspaceSchema,
  type CreateWorkspaceInput,
} from "../schemas/workspace.schema";
import { useCreateWorkspace } from "../hooks/useCreateWorkspace";
import { toast } from "sonner";
import { Plus } from "lucide-react";

const AddWorkspace = () => {
  const form = useForm<CreateWorkspaceInput>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: { name: "" },
  });

  const { mutateAsync, isPending } = useCreateWorkspace();

  const onSubmit = async (values: CreateWorkspaceInput) => {
    try {
      await mutateAsync(values);
      form.reset();
    } catch (err) {
      console.log({ err });
      toast("Failed to create workspace", { duration: 4000 });
      // backend error handled globally (toast / interceptor)
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className=" w-full">
          <Plus />
          <p>Add Workspace</p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label>Workspace Name</Label>
            <Input {...form.register("name")} placeholder="Workspace name" />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWorkspace;
