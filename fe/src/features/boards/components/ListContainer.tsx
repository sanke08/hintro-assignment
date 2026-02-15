import AddList from "@/features/lists/components/AddList";
import ListItem from "@/features/lists/components/ListItem";
import { useListSocket } from "@/features/lists/hooks/useListSocket";
import type { List } from "@/lib/types";
import { useCallback, useState } from "react";

type Props = {
  boardId: string;
  lists?: List[];
  workspaceId: string;
};

const ListContainer = ({
  boardId,
  lists: initialLists,
  workspaceId,
}: Props) => {
  const [lists, setLists] = useState<List[]>(initialLists || []);
  console.log({ lists });

  const handleCreate = useCallback((list: List) => {
    setLists((prev) => [...prev, list]);
  }, []);

  const handleDelete = useCallback((list: List) => {
    setLists((prev) => prev.filter((l) => l.id !== list.id));
  }, []);

  useListSocket(boardId, handleCreate, handleDelete);

  return (
    <div className="overflow-x-auto overflow-y-hidden hidescrollbar w-full h-full flex-1 flex gap-4 snap-mandatory snap-x">
      {lists.map((list) => (
        <ListItem key={list.id} list={list} workspaceId={workspaceId} />
      ))}
      <AddList boardId={boardId} workspaceId={workspaceId} />
    </div>
  );
};

export default ListContainer;
