import { useParams } from "react-router-dom";
import { useWorkspaceBoards } from "../hooks/useWorkspaceBoards";
import { Building } from "lucide-react";
import BoardList from "../components/BoardList";
import AddBoardDialog from "@/features/boards/components/AddBoard";
import { Separator } from "@/components/ui/separator";

const WorkspacePage = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const {
    data: workspace,
    isLoading,
    isError,
  } = useWorkspaceBoards(workspaceId);

  if (isLoading) return <PageSkeleton />;

  if (isError) return <div>Error loading boards</div>;

  if (!workspace) return <div>Workspace not found</div>;

  return (
    <div className="w-full">
      <div className="w-fit flex gap-2 px-5">
        <Building />
        <p className=" font-semibold text-lg">{workspace.name} </p>
      </div>
      <Separator />
      <div className="grid justify-center w-full md:grid-cols-3 min-[412px]:grid-cols-2 sm:p-0 px-2 grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 lg:px-0 min-[412px]:gap-3 mt-5">
        <BoardList boards={workspace.boards} workspaceId={workspace.id} />
        <AddBoardDialog workspaceId={workspace.id} />
      </div>
    </div>
  );
};

export default WorkspacePage;

// ---------------- Skeletons ----------------
const PageSkeleton = () => (
  <div className="space-y-3 p-5">
    <InfoSkeleton />
    <Separator />
    <div className="grid justify-center w-full md:grid-cols-3 min-[412px]:grid-cols-2 sm:p-0 px-2 grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 lg:px-10 min-[412px]:gap-3 mt-5">
      <BoardSkeleton />
      <BoardSkeleton />
      <BoardSkeleton />
    </div>
  </div>
);

const BoardSkeleton = () => (
  <div className="w-full h-20 rounded-lg bg-neutral-700/50 animate-pulse shadow-lg shadow-neutral-500/50 relative" />
);

const InfoSkeleton = () => (
  <div className="w-40 flex gap-2 p-2 rounded-lg px-5">
    <div className="p-5 rounded-lg bg-neutral-400/70 animate-pulse w-max" />
    <div>
      <p className="font-semibold text-lg w-20 py-3 bg-neutral-400/50 animate-pulse rounded-md" />
      <p className="flex items-center gap-1 mt-1">
        <span className="w-3 py-2 animate-pulse bg-neutral-400/50" />
        <span className="w-10 rounded-md py-2 animate-pulse bg-neutral-400/50" />
      </p>
    </div>
  </div>
);
