import type { Workspace } from "@/lib/types";
import { Building } from "lucide-react";

const WorkspaceInfo = ({ workspace }: { workspace: Workspace | null }) => {
  return (
    <div className="w-max flex gap-2 border-b rounded-lg px-5">
      <Building className=" text-white bg-blue-500 rounded p-0.5" />{" "}
      <p className=" font-semibold text-lg">{workspace?.name} </p>
    </div>
  );
};

export default WorkspaceInfo;
