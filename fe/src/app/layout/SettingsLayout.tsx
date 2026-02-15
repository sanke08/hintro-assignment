import { NavLink, Outlet, useParams } from "react-router-dom";
import { useGetWorkspace } from "@/features/workspace/hooks/useGetWorkspace";
import {
  Check,
  Copy,
  Loader2,
  RefreshCcw,
  Settings,
  Share,
  User,
} from "lucide-react";
import { WorkspaceContext } from "../context/SettingsContext";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import WorkspaceInfo from "@/features/workspace/components/WorkspaceInfo";
import { Input } from "@/components/ui/input";
import { usegenerateInvideCode } from "@/features/workspace/hooks/usegenerateInvideCode";

const SettingsLayout = () => {
  const { workspaceId } = useParams();
  const [copied, setCopied] = useState(false);

  if (!workspaceId) return null;

  const { data: workspace, isPending } = useGetWorkspace(workspaceId);
  const { mutateAsync: refresh, isPending: refreshPending } =
    usegenerateInvideCode({
      workspaceId,
    });

  if (isPending) {
    return <Loader2 className="w-10 h-10 animate-spin" />;
  }

  if (!workspace) {
    return <p>Workspace not found</p>;
  }

  const inviteUrl = `${window.location.origin}/invite/${workspace.inviteCode}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = async () => {
    await refresh();
  };

  return (
    <WorkspaceContext.Provider value={workspace}>
      <div className="flex gap-6">
        <div>
          <WorkspaceInfo workspace={workspace} />

          <div className="flex flex-col gap-3 mt-10">
            <NavLink
              to="members"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 p-2 px-6 rounded bg-neutral-200",
                  isActive && "bg-sky-500/20"
                )
              }
            >
              <User /> Members
            </NavLink>

            <NavLink
              to="settings"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 p-2 px-6 rounded bg-neutral-200",
                  isActive && "bg-sky-500/20"
                )
              }
            >
              <Settings /> Settings
            </NavLink>

            <div className="bg-neutral-200 p-2 px-6 rounded mt-5">
              <div className="flex items-center gap-2">
                <Share />
                <Input readOnly value={inviteUrl} />
                <Button
                  onClick={handleCopy}
                  variant="ghost"
                  className="relative h-8 w-8 p-1"
                >
                  <Copy
                    className={cn(
                      "absolute transition-all",
                      copied && "scale-0"
                    )}
                  />
                  <Check
                    className={cn(
                      "absolute transition-all",
                      !copied && "scale-0 text-green-500"
                    )}
                  />
                </Button>
                {/* refresh invite code  */}
                <Button
                  onClick={handleRefresh}
                  variant="ghost"
                  className="h-8 w-8 p-1"
                  disabled={refreshPending}
                >
                  {refreshPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCcw />
                  )}
                </Button>
              </div>

              {copied && (
                <p className="text-green-600 text-xs text-right mt-1">copied</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </WorkspaceContext.Provider>
  );
};

export default SettingsLayout;
