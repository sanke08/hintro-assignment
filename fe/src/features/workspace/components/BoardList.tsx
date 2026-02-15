import type { Board } from "@/lib/types";
import { Link } from "react-router-dom";

type Props = {
  boards?: Board[];
  workspaceId: string;
};

const BoardList = ({ boards, workspaceId }: Props) => {
  if (!boards?.length) {
    return;
  }
  return (
    <>
      {boards.map((board) => (
        <Link
          key={board.id}
          to={`/${workspaceId}/boards/${board.id}`}
          className="w-full h-20 flex items-center border rounded-lg shadow"
        >
          <p className="p-2 text-sm font-medium text-center w-full">
            {board.title}
          </p>
        </Link>
      ))}
    </>
  );
};

export default BoardList;
