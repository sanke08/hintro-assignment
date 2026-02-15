import { useWorkspace } from "@/app/context/SettingsContext";
import MemberCard from "../components/MemberCard";
import useAuthUser from "@/features/auth/hooks/useAuthUser";
import { Loader2 } from "lucide-react";

const Members = () => {
  const workspace = useWorkspace();
  const { user, isLoading } = useAuthUser();

  return (
    <div className="p-5 border border-neutral-900/20 rounded-lg h-full w-full mx-auto lg:w-full mt-2">
      <div className="text-4xl font-semibold">Members</div>
      <p className="text-neutral-900/50">View and manage workspace members</p>

      <div className="mt-5 w-full flex flex-col">
        {/* Table Header */}
        <div className="flex w-full border-b pb-1 font-semibold">
          <div className="w-[55%] md:w-[50%]">User</div>
          <div className="w-[30%] md:w-[20%]">Role</div>
          <div className="w-[15%] hidden md:block">Joined</div>
          <div className="w-[10%]">Action</div>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          //  {/* Members List */}
          <div className="space-y-2">
            {workspace?.members && workspace.members.length > 0 ? (
              workspace?.members.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  workspace={workspace}
                  isOwner={workspace?.creatorId == user?.id}
                />
              ))
            ) : (
              <div className="text-center py-10 text-neutral-500">
                No members found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Members;
