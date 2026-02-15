// import { Navigate, Outlet } from "react-router-dom";
// import { Loader } from "lucide-react";
// import useAuthUser from "@/features/auth/hooks/useAuthUser";
// import { useWorkspaceMembers } from "@/features/workspace/hooks/useWorkspaceMembers";
// import { Navbar } from "@/components/Navbar";
// import Sidebar from "@/components/sidebar/Sidebar";
// import type { User } from "@/lib/types";
// import { Toaster } from "@/components/ui/sonner";
// import SocketProvider from "../providers/SocketProvider";

// export default function WorkspaceLayout() {
//   const { user, isLoading: userLoading } = useAuthUser();

//   const { data: workspaces, isLoading: workspacesLoading } =
//     useWorkspaceMembers();

//   if (userLoading || workspacesLoading) {
//     return <Loader className="animate-spin" />;
//   }

//   if (!user) {
//     return <Navigate to="/auth" replace />;
//   }

//   return (
//     <SocketProvider>
//       <div className="px-24">
//         <Toaster />
//         <Navbar workspaces={workspaces} user={user as User} />
//         <div className="pt-14 mt-4 flex gap-10">
//           <div className=" min-w-60 max-w-60 w-60 sticky top-18 self-start border-r border-neutral-300 pr-2">
//             <Sidebar workspaces={workspaces} user={user as User} />
//           </div>
//           <div className="mt-2 w-full">
//             <Outlet />
//           </div>
//         </div>
//       </div>
//     </SocketProvider>
//   );
// }

import { Navigate, Outlet } from "react-router-dom";
import { Loader, Menu } from "lucide-react";
import useAuthUser from "@/features/auth/hooks/useAuthUser";
import { useWorkspaceMembers } from "@/features/workspace/hooks/useWorkspaceMembers";
import { Navbar } from "@/components/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";
import type { User } from "@/lib/types";
import { Toaster } from "@/components/ui/sonner";
import SocketProvider from "../providers/SocketProvider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function WorkspaceLayout() {
  const { user, isLoading: userLoading } = useAuthUser();
  const { data: workspaces, isLoading: workspacesLoading } =
    useWorkspaceMembers();

  if (userLoading || workspacesLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <SocketProvider>
      <Toaster />

      {/* Navbar */}
      <Navbar />

      <div className="pt-14 flex max-w-450 px-4 mx-auto md:px-10">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-80 border-r border-neutral-300 sticky top-14 h-[calc(100vh-3.5rem)] p-4">
          <Sidebar workspaces={workspaces} user={user as User} />
        </aside>

        {/* Mobile Sidebar */}
        <div className="md:hidden fixed top-4 left-4 z-50">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 rounded-md border bg-background">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className=" py-10 px-2">
              <Sidebar workspaces={workspaces} user={user as User} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Content */}
        <main className="flex-1 h-full w-full md:px-8 py-4 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </SocketProvider>
  );
}
