import { useState } from "react";
import { Image, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWorkspace } from "@/app/context/SettingsContext";
import { useUpdateWorkspace } from "@/features/workspace/hooks/useUpdateWorkspace";

const Settings = () => {
  const workspace = useWorkspace();
  const { mutateAsync: updateWorkspace, isPending: isUpdating } =
    useUpdateWorkspace();

  const [name, setName] = useState(workspace?.name || "");

  const handleUpdate = async () => {
    await updateWorkspace({
      workspaceId: workspace?.id || "",
      name,
    });
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this workspace? This action cannot be undone."
      )
    ) {
    }
  };

  const handleLeave = () => {
    if (window.confirm("Are you sure you want to leave this workspace?")) {
    }
  };

  return (
    <div className="px-4 border border-neutral-500/40 w-full rounded-lg p-5 mx-auto mt-2">
      <div className="text-4xl font-semibold">Settings</div>
      <p>Manage workspace settings</p>

      <div className="mt-10 w-full flex flex-col">
        <Label htmlFor="workspace-title" className="font-medium">
          Workspace Profile
        </Label>
        <div className="space-y-4 mt-3">
          <div className="relative flex items-center w-full">
            <Image className="absolute left-3 h-5 w-5 text-neutral-500" />
            <Input
              id="workspace-title"
              value={name}
              placeholder="Workspace name"
              onChange={(e) => setName(e.target.value)}
              className="pl-10 w-full md:w-2/3"
              disabled={isUpdating}
            />
          </div>

          <Button
            onClick={handleUpdate}
            disabled={name.length === 0 || isUpdating}
            className="w-full md:w-1/3"
          >
            {isUpdating ? "Updating..." : "Update"}
          </Button>
        </div>
      </div>

      <div className="mt-10 border border-neutral-500/20 p-5 rounded-lg">
        <p className="font-medium text-red-500">Danger Zone</p>
        <div className="space-x-5 flex mt-5 flex-wrap gap-3">
          <Button
            onClick={handleLeave}
            // disabled={isLeaving}
            variant="ghost"
            className="flex items-center text-red-500 border border-neutral-500/50 hover:text-red-500 hover:bg-slate-200/50"
          >
            <X className="h-4 mr-2" />
            {false ? "Leaving..." : "Leave Workspace"}
          </Button>
          <Button
            onClick={handleDelete}
            // disabled={isDeleting}
            variant="ghost"
            className="flex items-center text-red-500 border border-neutral-500/50 hover:text-red-500 hover:bg-slate-200/50"
          >
            <X className="h-4 mr-2" />
            {false ? "Deleting..." : "Delete Workspace"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
