"use client";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Workspace, User } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Activity,
  Building,
  Layout,
  Settings,
  ShieldCheck,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { twMerge } from "tailwind-merge";

type Props = {
  workspace: Workspace;
  user: User;
};

const NavItem = ({ workspace, user }: Props) => {
  const location = useLocation();
  const params = useParams();
  const [toggle, setToggle] = useState<boolean>(false);

  const routes = [
    {
      label: "Boards",
      icon: <Layout className="h-5 w-5" />,
      href: `/${workspace.id}`,
    },
    {
      label: "Audits",
      icon: <Activity className="h-5 w-5" />,
      href: `/${workspace.id}/audits`,
    },
    {
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
      href: `/${workspace.id}/settings`,
    },
    {
      label: "Trash",
      icon: <Trash className="h-5 w-5" />,
      href: `/${workspace.id}/trash`,
    },
  ];

  return (
    <AccordionItem value={workspace.id} className="space-y-1">
      <AccordionTrigger
        onClick={() => setToggle((pre) => !pre)}
        className={twMerge(
          "border border-neutral-300 hover:no-underline p-2 px-4 rounded-md",
          params?.workspaceId === workspace.id && "bg-sky-200/50",
          toggle && params?.workspaceId === workspace.id && "bg-white"
        )}
      >
        <div className="flex items-center justify-between gap-x-2 w-full">
          <div className="w-full flex gap-2 items-center">
            <Building />
            <span className="font-medium text-sm">{workspace.name}</span>
          </div>
          {workspace.creatorId === user.id && (
            <ShieldCheck className="h-5 w-5 text-green-500" />
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent className="border-b">
        {routes.map((route) => (
          <Link
            to={route.href}
            key={route.label}
            className={cn(
              "w-full font-normal flex gap-2 hover:bg-sky-500/10 py-2 px-5",
              (location.pathname === route.href ||
                (params?.boardId && route.label === "Boards")) &&
                "bg-sky-500/10 text-sky-700 my-[2px]"
            )}
          >
            {route.icon}
            {route.label}
          </Link>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};

export default NavItem;
