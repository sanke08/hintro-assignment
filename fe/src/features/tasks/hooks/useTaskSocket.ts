import { useSocket } from "@/app/providers/SocketProvider";
import type { Task } from "@/lib/types";
import { useEffect } from "react";

export const useTaskSocket = ({
  listId,
  onCreate,
  onUpdate,
  onDelete,
}: {
  listId: string;
  onCreate: (task: Task) => void;
  onUpdate: (task: Task) => void;
  onDelete: (task: Task) => void;
}) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on(`task:created`, onCreate);
    socket.on(`task:updated`, onUpdate);
    socket.on(`task:deleted`, onDelete);

    return () => {
      socket.off(`task:created`, onCreate);
      socket.off(`task:updated`, onUpdate);
      socket.off(`task:deleted`, onDelete);
    };
  }, [socket, listId, onCreate, onUpdate, onDelete]);
};
