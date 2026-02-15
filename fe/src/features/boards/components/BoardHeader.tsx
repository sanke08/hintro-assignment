import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";

import { useUpdateBoard } from "../hooks/useUpdateBoard";
import { useTrashBoard } from "../hooks/useTrashBoard";
import type { Board, Member } from "@/lib/types";

type Props = {
  board: Board;
  member: Member | null;
};

const BoardHeader = ({ board, member }: Props) => {
  const [title, setTitle] = useState(board.title);

  const updateMutation = useUpdateBoard({
    boardId: board.id,
    workspaceId: board.workspaceId,
  });

  const trashMutation = useTrashBoard({
    boardId: board.id,
    workspaceId: board.workspaceId,
  });

  const isAdmin = member?.role === "ADMIN";

  return (
    <div className="w-full h-fit p-3 py-1 px-6 flex bg-neutral-200 justify-between items-center rounded">
      <p className="font-medium text-xl">{board.title}</p>

      {isAdmin && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="space-y-2">
            {/* Update title */}
            <div className="flex gap-2">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              <Button
                onClick={() => updateMutation.mutate({ title })}
                disabled={!title}
                isLoading={updateMutation.isPending}
              >
                Update
              </Button>
            </div>

            <Button
              variant="destructive"
              onClick={() => trashMutation.mutate()}
              isLoading={trashMutation.isPending}
              className="w-full text-white"
            >
              <Trash className="h-4 mr-2" /> Move to Trash
            </Button>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default BoardHeader;
