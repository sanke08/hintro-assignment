import { Accordion } from "@/components/ui/accordion";
import NavItem from "./NavItem.tsx";
import type { Workspace, User } from "@/lib/types";
import AddWorkspace from "@/features/workspace/components/AddWorkspace.tsx";
import UserButton from "../UserButton.tsx";

interface Props {
  workspaces: Array<Workspace>;
  user: User;
}

const Sidebar = ({ workspaces, user }: Props) => {
  if (!workspaces || workspaces.length === 0) return null;

  return (
    <div className="w-full overflow-y-auto hidescrollbar flex flex-col h-[calc(100vh-5rem)] space-y-3">
      <AddWorkspace />
      <Accordion type="multiple" className=" flex-1 h-full">
        {workspaces?.map((workspace) => (
          <NavItem key={workspace.id} workspace={workspace} user={user} />
        ))}
      </Accordion>
      <UserButton user={user} />
    </div>
  );
};

export default Sidebar;
