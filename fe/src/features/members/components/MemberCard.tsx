import React, { useState } from "react";
import { LogOut, MoreVertical, ShieldCheck, User2 } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRemoveMember } from "@/features/members/hooks/useRemoveMembers";
import { useChangeRole } from "@/features/members/hooks/useChangeRole";
import type { Workspace, Member } from "@/lib/types";

interface MemberCardProps {
  member: Member;
  workspace: Workspace;
  isOwner: boolean;
}

const MemberCard: React.FC<MemberCardProps> = ({
  member,
  workspace,
  isOwner,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: removeMember, isPending: isRemoving } = useRemoveMember();
  const { mutate: changeRole, isPending: isChangingRole } = useChangeRole();

  const handleRemove = () => {
    if (
      window.confirm(
        `Are you sure you want to remove ${
          member?.user?.name || member.user?.email
        }?`
      )
    ) {
      removeMember({
        workspaceId: workspace.id,
        memberId: member.id,
      });
      setIsOpen(false);
    }
  };

  const handleChangeRole = () => {
    const newRole = member.role === "ADMIN" ? "MEMBER" : "ADMIN";
    if (
      window.confirm(
        `Change ${
          member.user?.name || member.user?.email
        }'s role to ${newRole}?`
      )
    ) {
      changeRole({
        workspaceId: workspace.id,
        memberId: member.id,
        role: newRole,
      });
      setIsOpen(false);
    }
  };

  return (
    <div className="w-full flex items-center border-b h-12">
      {/* User Info */}
      <div className="flex flex-col w-[55%] md:w-[50%] overflow-hidden">
        <p className="truncate">{member.user?.name || "Unknown"}</p>
        <p className="text-xs text-neutral-500 truncate">
          {member.user?.email}
        </p>
      </div>

      {/* Role */}
      <div className="w-[30%] md:w-[20%] flex gap-2 items-center">
        {member.role === "ADMIN" ? (
          <ShieldCheck className="text-green-600 h-5 w-5" />
        ) : (
          <User2 className="h-5 w-5" />
        )}
        <p
          className={twMerge(
            "text-sm",
            member.role === "ADMIN" && "text-green-600"
          )}
        >
          {member.role}
        </p>
      </div>

      {/* Joined Date */}
      <div className="w-[15%] hidden md:block text-sm">
        {new Date(member.createdAt).toLocaleDateString()}
      </div>

      {/* Actions */}
      <div className="w-[10%]">
        {isOwner && (
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="space-x-3 p-2 h-8 w-8"
                size="sm"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col space-y-2 w-auto">
              <Button
                onClick={handleRemove}
                disabled={isRemoving || isChangingRole}
                variant="outline"
                className="space-x-3 text-rose-500 hover:text-rose-600 hover:bg-rose-50 justify-start"
                size="sm"
              >
                <LogOut className="h-4 w-4" />
                <span>{isRemoving ? "Removing..." : "Remove"}</span>
              </Button>

              <Button
                onClick={handleChangeRole}
                disabled={isRemoving || isChangingRole}
                variant="outline"
                size="sm"
                className="justify-start"
              >
                {isChangingRole
                  ? "Changing..."
                  : `Change to ${member.role === "ADMIN" ? "Member" : "Admin"}`}
              </Button>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};

export default MemberCard;
