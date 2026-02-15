import type { User } from "@/lib/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { api } from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { queryClient } from "@/lib/queryClient";

const UserButton = ({ user }: { user: User }) => {
  const [leaveOpen, setLeaveOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = async () => {
    await api.get("/auth/logout");
    navigate("/auth");
    queryClient.clear();
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="h-auto w-full justify-start gap-3 px-2 py-2 border"
          >
            {/* Avatar */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-200 text-sm font-semibold uppercase">
              {user.name.charAt(0)}
            </div>

            {/* User info */}
            <div className="flex flex-col items-start leading-tight">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
            <ChevronRight />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-48 p-2">
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => setLeaveOpen(true)}
            >
              Leave workspace
            </Button>

            <Button
              onClick={handleLogout}
              variant="ghost"
              className="justify-start text-red-600"
            >
              Logout
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Leave Workspace Dialog */}
      <Dialog open={leaveOpen} onOpenChange={setLeaveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave workspace</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Are you sure you want to leave this workspace? You will lose access.
          </p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setLeaveOpen(false)}>
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                setLeaveOpen(false);
                // TODO: handle leave workspace logic
              }}
            >
              Confirm leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserButton;
