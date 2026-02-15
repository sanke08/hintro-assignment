import { Button } from "@/components/ui/button";
import { useGetInviteLink } from "@/features/workspace/hooks/useGetInviteLink";
import { useJoinWorkspace } from "@/features/workspace/hooks/useJoinWorkspace";
import { AxiosError } from "axios";
import { Workflow } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const InvitePage = () => {
  const { inviteCode } = useParams();
  const {
    data: workspace,
    isPending,
    error,
  } = useGetInviteLink(inviteCode as string);
  const { mutateAsync, isPending: joining } = useJoinWorkspace();

  if (error instanceof AxiosError) {
    if (error.response?.status === 401) {
      return (
        <div className="flex justify-center items-center h-screen">
          <Link to="/auth">
            <Button>Required Login</Button>
          </Link>
        </div>
      );
    }
    if (error.response?.status === 404) {
      return <div>Workspace not found</div>;
    }
  }
  if (isPending) return <div>Loading...</div>;
  if (!workspace) return <div>Workspace not found</div>;

  return (
    <div className=" w-full h-screen bg-slate-200 flex justify-center items-center">
      <div className="bg-white rounded-lg w-96 p-5 space-y-10 flex flex-col items-center">
        <div className=" flex items-center justify-between w-full">
          <div>
            <div className=" flex space-x-2 items-center">
              <Workflow />
              <p className=" text-4xl">{workspace.name}</p>
            </div>
            <div className=" pl-10 text-sm text-neutral-500">
              <p>by {workspace.creator?.name} </p>
            </div>
          </div>
          <div>{workspace.members?.length} Members</div>
        </div>
        <Button
          isLoading={joining}
          className="mx-auto"
          onClick={() => mutateAsync({ inviteCode: inviteCode as string })}
        >
          {joining ? "Joining..." : "Join Workspace"}
        </Button>
      </div>
    </div>
  );
};

export default InvitePage;
