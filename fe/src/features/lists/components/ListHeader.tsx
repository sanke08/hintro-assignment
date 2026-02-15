import { useState } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import type { List } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import ListOption from "./ListOption";
import { useUpdateList } from "../hooks/useUpdateList";
import {
  updateListSchema,
  type UpdateListInput,
} from "../schemas/lists.schema";
import { Button } from "@/components/ui/button";

type Props = {
  list: List;
  workspaceId: string;
};

const ListHeader = ({ list, workspaceId }: Props) => {
  const [editing, setEditing] = useState(false);

  const { mutateAsync, isPending } = useUpdateList();

  const form = useForm<UpdateListInput>({
    resolver: zodResolver(updateListSchema),
    defaultValues: {
      title: list.title,
      listId: list.id,
      boardId: list.boardId,
      workspaceId,
    },
  });

  const onSubmit = async (values: UpdateListInput) => {
    await mutateAsync(values);
    setEditing(false);
  };

  const handleBlur = () => {
    if (form.formState.isDirty) {
      form.handleSubmit(onSubmit)();
    } else {
      setEditing(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center gap-2">
        {editing ? (
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center gap-2 flex-1"
          >
            <Input
              {...form.register("title")}
              disabled={isPending}
              autoFocus
              onBlur={handleBlur}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  form.reset();
                  setEditing(false);
                }
                if (e.key === "Enter") {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)();
                }
              }}
              className="border-none px-2 font-medium h-full flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                form.reset();
                setEditing(false);
              }}
              className="h-6 w-6"
            >
              <X size={14} />
            </Button>
          </form>
        ) : (
          <p
            onDoubleClick={() => setEditing(true)}
            className="font-medium cursor-pointer px-2 flex-1"
          >
            {list.title}
          </p>
        )}
        <ListOption
          listId={list.id}
          boardId={list.boardId}
          workspaceId={workspaceId}
        />
      </div>
      <p className="text-[10px] text-neutral-500">
        {new Date(list.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default ListHeader;
