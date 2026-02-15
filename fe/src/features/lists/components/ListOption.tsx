import { MoreHorizontal } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useTrashList } from "../hooks/useTrashList";

const ListOption = ({
  listId,
  boardId,
  workspaceId,
}: {
  listId: string;
  workspaceId: string;
  boardId: string;
}) => {
  const { mutate, isPending } = useTrashList();

  const handleTrash = () => {
    mutate({ boardId, workspaceId, listId });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="flex flex-col space-y-2 w-52">
        <div className="text-center font-medium">List actions</div>
        <Button
          variant="secondary"
          className="text-red-500"
          isLoading={isPending}
          onClick={handleTrash}
        >
          Move list to trash
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default ListOption;
