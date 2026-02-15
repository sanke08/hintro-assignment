import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { List } from "@/lib/types";
import { useTaskSocket } from "@/features/tasks/hooks/useTaskSocket";
import AddTask from "@/features/tasks/components/AddTask";
import ListHeader from "./ListHeader";
import TaskCard from "@/features/tasks/components/TaskCard";
import { cn } from "@/lib/utils";

type Props = {
  list: List;
  workspaceId: string;
};

const ListItem = ({ list, workspaceId }: Props) => {
  const [tasks, setTasks] = useState(list.tasks || []);
  const [searchParams] = useSearchParams();
  console.log({ tasks });

  useTaskSocket({
    listId: list.id,
    onCreate: (task) => {
      if (task.listId !== list.id) return;
      setTasks((prev) => [...prev, task]);
    },
    onUpdate: (task) => {
      if (task.listId !== list.id) return;
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    },
    onDelete: (task) => {
      if (task.listId !== list.id) return;
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    },
  });

  const isHovered = searchParams.get("hover") === list.id;

  return (
    <div
      className={cn(
        "bg-neutral-100 p-2 rounded-md h-fit border shrink-0 basis-[80%] md:basis-auto md:w-80 snap-start",
        isHovered && "bg-sky-200/80"
      )}
    >
      <ListHeader list={list} workspaceId={workspaceId} />

      <div className="flex flex-col space-y-2 mt-2">
        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            index={index}
            boardId={list.boardId}
            workspaceId={workspaceId}
            listId={list.id}
          />
        ))}
      </div>

      <AddTask
        listId={list.id}
        boardId={list.boardId}
        workspaceId={workspaceId}
      />
    </div>
  );
};

export default ListItem;
