import { Link, useParams } from "react-router-dom";
import { useGetAudits } from "../hooks/useGetAudits";
import WorkspaceInfo from "@/features/workspace/components/WorkspaceInfo";
import type { AuditLog, Workspace } from "@/lib/types";
import { format } from "date-fns";
import { User } from "lucide-react";

const AuditLogPage = () => {
  const { workspaceId } = useParams();
  const { data, isPending } = useGetAudits({
    workspaceId: workspaceId as string,
  });
  if (isPending) return <div>Loading...</div>;
  const { auditLogs, ...workspace } = data as Workspace;

  return (
    <div>
      <WorkspaceInfo workspace={workspace} />
      <p className=" mt-5 text-3xl pl-5 sm:pl-0">Activities</p>
      <div className=" space-y-2 mt-5 sm:pl-10 flex">
        {/* <Skeleton/> */}
        <div className=" space-y-5 w-full">
          {auditLogs &&
            auditLogs.map((audit) => {
              let link = "";
              if (audit.entityType === "BOARD" && audit.action !== "DELETE")
                link = `/${workspace.id}/boards/${audit.entityId}`;
              if (audit.entityType === "TASK" && audit.action !== "DELETE")
                link = `/${workspace.id}/boards/${audit.boardId}?hover=${audit.entityId}`;
              if (audit.entityType === "LIST" && audit.action !== "DELETE")
                link = `/${workspace.id}/boards/${audit.boardId}?hover=${audit.entityId}`;
              return (
                <Link
                  to={link}
                  key={audit.id}
                  className="px-3 py-1 w-full border-b-2 flex items-center"
                >
                  <User className=" h-full aspect-square" />
                  <div className="flex flex-col space-y-0.5 ">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold lowercase text-neutral-700">
                        {audit.userName}
                      </span>{" "}
                      {generateLogMessage(audit)}{" "}
                      <span className=" font-semibold">
                        {audit.entityTitle}{" "}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(
                        new Date(audit.createdAt),
                        "MMM d, yyyy 'at' h:mm a"
                      )}
                    </p>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default AuditLogPage;

const generateLogMessage = (log: AuditLog) => {
  const { action, entityType } = log;

  switch (action) {
    case "CREATE":
      return `created ${entityType.toLowerCase()} : `;
    case "UPDATE":
      return `updated ${entityType.toLowerCase()} : `;
    case "DELETE":
      return `deleted ${entityType.toLowerCase()} : `;
    case "JOINED":
      return `joined`;
    case "ROLE_CHANGED":
      return `change role of ${entityType.toLowerCase()} : `;
    case "REMOVE":
      return `removed ${entityType.toLowerCase()} : `;
    case "RESTORED":
      return `restored ${entityType.toLowerCase()} : `;
    case "TRASHED":
      return `trashed ${entityType.toLowerCase()} : `;
    default:
      return `unknown action ${entityType.toLowerCase()} :`;
  }
};
