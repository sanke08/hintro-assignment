import { Loader2, UserCheck, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUpdateTask } from "../hooks/useUpdateTask";
import type { Task } from "@/lib/types";
import { useGetMembers } from "../hooks/useGetMembers";

type TaskAssignedByProps = {
  task: Task;
  boardId: string;
  workspaceId: string;
  listId: string;
};

const TaskAssignedBy = ({
  task,
  boardId,
  workspaceId,
  listId,
}: TaskAssignedByProps) => {
  const [open, setOpen] = useState(false);
  const { mutateAsync: updateTask, isPending } = useUpdateTask();

  // Fetch workspace members
  const { data: members = [], isLoading: loadingMembers } = useGetMembers({
    workspaceId,
  });

  const handleAssignedByChange = async (assignedById: string | null) => {
    await updateTask({
      assignedById,
      boardId,
      listId,
      taskId: task.id,
      workspaceId,
    });
    setOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-neutral-700">By</span>

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={isPending || loadingMembers}
            className="h-auto py-1.5"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : task.assignedBy ? (
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage
                    src={task.assignedBy?.user?.avatar || undefined}
                  />
                  <AvatarFallback className="text-xs bg-purple-100 text-purple-700">
                    {getInitials(task.assignedBy?.user?.name || "?")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{task.assignedBy?.user?.name}</span>
              </div>
            ) : (
              <>
                <UserCheck className="w-4 h-4 mr-2" />
                Set assigner
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          {task.assignedBy && (
            <>
              <DropdownMenuItem
                onClick={() => handleAssignedByChange(null)}
                className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-2" />
                Remove assigner
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuLabel className="text-xs text-neutral-500">
            Workspace Members
          </DropdownMenuLabel>

          {loadingMembers ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
            </div>
          ) : members.length === 0 ? (
            <div className="py-6 text-center text-sm text-neutral-500">
              No members found
            </div>
          ) : (
            members.map((member) => (
              <DropdownMenuItem
                key={member.id}
                onClick={() => handleAssignedByChange(member.id)}
                className="cursor-pointer"
                disabled={member.id === task.assignedById}
              >
                <Avatar className="w-6 h-6 mr-2">
                  <AvatarImage src={member.user?.avatar || undefined} />
                  <AvatarFallback className="text-xs bg-purple-100 text-purple-700">
                    {getInitials(
                      member.user?.name || member.user?.email || "?"
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-medium">
                    {member.user?.name || member.user?.email}
                  </span>
                  {member.user?.name && (
                    <span className="text-xs text-neutral-500">
                      {member.user?.email}
                    </span>
                  )}
                </div>
                {member.id === task.assignedById && (
                  <span className="text-xs text-purple-600 ml-2">Current</span>
                )}
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TaskAssignedBy;
