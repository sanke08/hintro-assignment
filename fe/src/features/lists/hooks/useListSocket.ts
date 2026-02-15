import { useEffect } from "react";
import type { List } from "@/lib/types";
import { useSocket } from "@/app/providers/SocketProvider";

export const useListSocket = (
  boardId: string,
  onCreate: (list: List) => void,
  onTrash: (list: List) => void
) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.emit("join-board", boardId);

    socket.on(`list:created`, onCreate);
    socket.on(`list:trashed`, onTrash);

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    return () => {
      socket.emit("leave-board", boardId);
      socket.off(`list:created`, onCreate);
      socket.off(`list:trashed`, onTrash);
      socket.off("error");
      socket.off("connect_error");
    };
  }, [socket, boardId]);
};
