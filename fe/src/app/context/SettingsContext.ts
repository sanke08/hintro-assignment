import { createContext, useContext } from "react";
import type { Workspace } from "@/lib/types";

export const WorkspaceContext = createContext<Workspace | null>(null);

export const useWorkspace = () => {
  const workspace = useContext(WorkspaceContext);
  if (!workspace) {
    throw new Error("useWorkspace must be used inside WorkspaceLayout");
  }
  return workspace;
};
