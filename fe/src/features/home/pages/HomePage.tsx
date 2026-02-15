// import { api } from "@/lib/axios";
// import type { Task } from "@/lib/types";
// import { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import { Calendar, User, UserCheck } from "lucide-react";

// const HomePage = () => {
//   const { workspaceId } = useParams();
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fn = async () => {
//       try {
//         const { data } = await api.get(`/workspaces/${workspaceId}/tasks`);
//         const tasksArray = Object.values(data.data) as Task[];
//         setTasks(tasksArray);
//       } catch (error) {
//         console.error("Error fetching tasks:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fn();
//   }, [workspaceId]);

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case "URGENT":
//         return "bg-red-500 text-white";
//       case "HIGH":
//         return "bg-orange-500 text-white";
//       case "MEDIUM":
//         return "bg-yellow-500 text-white";
//       case "LOW":
//         return "bg-green-500 text-white";
//       default:
//         return "bg-gray-500 text-white";
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "TO_DO":
//         return "bg-slate-100 text-slate-700 border border-slate-200";
//       case "IN_PROGRESS":
//         return "bg-blue-100 text-blue-700 border border-blue-200";
//       case "COMPLETED":
//         return "bg-emerald-100 text-emerald-700 border border-emerald-200";
//       default:
//         return "bg-gray-100 text-gray-700 border border-gray-200";
//     }
//   };

//   const getInitials = (name: string) => {
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   const getAvatarColor = (name: string) => {
//     const colors = [
//       "bg-blue-600",
//       "bg-emerald-600",
//       "bg-purple-600",
//       "bg-pink-600",
//       "bg-indigo-600",
//       "bg-rose-600",
//       "bg-amber-600",
//       "bg-teal-600",
//     ];
//     const index = name.charCodeAt(0) % colors.length;
//     return colors[index];
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tasks</h1>
//           <p className="text-gray-600">
//             {tasks.length} {tasks.length === 1 ? "task" : "tasks"} in total
//           </p>
//         </div>

//         {tasks.length === 0 ? (
//           <div className="bg-white rounded-xl shadow-sm p-12 text-center">
//             <div className="text-gray-400 mb-4">
//               <svg
//                 className="w-16 h-16 mx-auto"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//                 />
//               </svg>
//             </div>
//             <p className="text-gray-500 text-lg">No tasks found</p>
//           </div>
//         ) : (
//           <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
//             {tasks.map((task) => {
//               const link = `/${task.list!.board!.workspaceId}/boards/${
//                 task.list!.boardId
//               }?hover=${task.id}`;
//               return (
//                 <Link
//                   to={link}
//                   key={task.id}
//                   className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-100 hover:border-blue-200"
//                 >
//                   <div className="p-5">
//                     {/* Header */}
//                     <div className="mb-4">
//                       <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
//                         {task.title}
//                       </h3>
//                       {task.description && (
//                         <p className="text-gray-600 text-sm line-clamp-2">
//                           {task.description}
//                         </p>
//                       )}
//                     </div>

//                     {/* Status and Priority Badges */}
//                     <div className="flex gap-2 mb-4">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
//                           task.priority
//                         )}`}
//                       >
//                         {task.priority}
//                       </span>
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
//                           task.status
//                         )}`}
//                       >
//                         {task.status.replace("_", " ")}
//                       </span>
//                     </div>

//                     {/* Due Date */}
//                     {task.dueDate && (
//                       <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
//                         <Calendar className="w-4 h-4" />
//                         <span>
//                           Due {new Date(task.dueDate).toLocaleDateString()}
//                         </span>
//                       </div>
//                     )}

//                     {/* Divider */}
//                     {(task.assignee || task.assignedBy) && (
//                       <div className="border-t border-gray-100 my-4"></div>
//                     )}

//                     {/* People Section */}
//                     <div className="space-y-3">
//                       {task.assignee && (
//                         <div className="flex items-center gap-3">
//                           <div
//                             className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-sm ${getAvatarColor(
//                               task.assignee.user!.name
//                             )}`}
//                           >
//                             {getInitials(task.assignee.user!.name)}
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <div className="flex items-center gap-1.5">
//                               <User className="w-3.5 h-3.5 text-gray-400" />
//                               <p className="text-sm font-medium text-gray-900 truncate">
//                                 {task.assignee.user!.name}
//                               </p>
//                             </div>
//                             <p className="text-xs text-gray-500 truncate">
//                               {task.assignee.user!.email}
//                             </p>
//                           </div>
//                         </div>
//                       )}

//                       {task.assignedBy && (
//                         <div className="flex items-center gap-3">
//                           <div
//                             className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-sm ${getAvatarColor(
//                               task.assignedBy.user!.name
//                             )}`}
//                           >
//                             {getInitials(task.assignedBy.user!.name)}
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <p className="text-xs text-gray-500 truncate">
//                               Assigned By
//                             </p>
//                             <div className="flex items-center gap-1.5">
//                               <UserCheck className="w-4 h-4 text-gray-400" />
//                               <p className=" text-gray-700 truncate">
//                                 {task.assignedBy.user!.name}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     {/* Footer */}
//                     <div className="mt-4 pt-4 border-t border-gray-100">
//                       <p className="text-xs text-gray-400">
//                         Created {new Date(task.createdAt).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </div>
//                 </Link>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HomePage;

import { Link, useSearchParams } from "react-router-dom";
import { Calendar, User, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const priority = searchParams.get("priority") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

  const updateFilters = (updates: Record<string, string | undefined>) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(updates).forEach(([key, value]) => {
          if (value) {
            next.set(key, value);
          } else {
            next.delete(key);
          }
        });
        return next;
      },
      { replace: true }
    );
  };

  const { data: tasks = [], isLoading } = useGetMyTasks({
    search,
    status: status || undefined,
    priority: priority || undefined,
    sortBy,
    sortOrder,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-600">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="w-full md:w-64">
            <Input
              placeholder="Search tasks..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFilters({ search: e.target.value })
              }
              className="bg-white"
            />
          </div>

          <select
            value={status}
            onChange={(e) => updateFilters({ status: e.target.value })}
            className="h-10 px-3 py-2 bg-white border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="TO_DO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="DONE">Done</option>
          </select>

          <select
            value={priority}
            onChange={(e) => updateFilters({ priority: e.target.value })}
            className="h-10 px-3 py-2 bg-white border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => updateFilters({ sortBy: e.target.value })}
            className="h-10 px-3 py-2 bg-white border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="createdAt">Created At</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>

          <button
            onClick={() =>
              updateFilters({ sortOrder: sortOrder === "asc" ? "desc" : "asc" })
            }
            className="h-10 px-3 py-2 bg-white border border-input rounded-md text-sm hover:bg-gray-50 flex items-center gap-2"
          >
            {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
          </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500 border border-dashed border-gray-300">
          No tasks match your filters
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => {
            const link = `/${task?.list?.board?.workspaceId}/boards/${task?.list?.boardId}?hover=${task.id}`;

            return (
              <Link
                key={task.id}
                to={link}
                className="group bg-white rounded-xl border shadow-sm hover:shadow-lg transition"
              >
                <div className="p-5">
                  <h3 className="text-lg font-semibold group-hover:text-blue-600">
                    {task.title}
                  </h3>

                  {task.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {task.description}
                    </p>
                  )}

                  <div className="flex gap-2 my-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        priorityColorMap[task.priority]
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        statusColorMap[task.status]
                      }`}
                    >
                      {task.status.replace("_", " ")}
                    </span>
                  </div>

                  {task.dueDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      Due Date:
                      <Calendar className="w-4 h-4" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  )}

                  {(task.assignee || task.assignedBy) && (
                    <div className="border-t pt-4 space-y-3">
                      {task.assignee && (
                        <PersonRow
                          label="To"
                          name={task.assignee.user?.name}
                          email={task.assignee.user?.email}
                          icon={<User className="w-3.5 h-3.5" />}
                        />
                      )}

                      {task.assignedBy && (
                        <PersonRow
                          label="By"
                          name={task.assignedBy.user?.name}
                          icon={<UserCheck className="w-4 h-4" />}
                        />
                      )}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

type PersonRowProps = {
  label: string;
  name?: string | null;
  email?: string | null;
  icon: React.ReactNode;
};

const PersonRow = ({ label, name, email, icon }: PersonRowProps) => (
  <div className="flex items-center gap-3">
    <p className="text-xs">{label}</p>
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${getAvatarColor(
        name
      )}`}
    >
      {getInitials(name)}
    </div>
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-sm font-medium">
        {icon}
        {name}
      </div>
      {email && <p className="text-xs text-gray-500 truncate">{email}</p>}
    </div>
  </div>
);

export default HomePage;

import type { PRIORITY, STATUS } from "@/lib/types";
import { useGetMyTasks } from "../hooks/useGetMyTaks";

export const priorityColorMap: Record<PRIORITY, string> = {
  URGENT: "bg-red-500 text-white",
  HIGH: "bg-orange-500 text-white",
  MEDIUM: "bg-yellow-500 text-white",
  LOW: "bg-green-500 text-white",
};

export const statusColorMap: Record<STATUS, string> = {
  TO_DO: "bg-slate-100 text-slate-700 border border-slate-200",
  IN_PROGRESS: "bg-blue-100 text-blue-700 border border-blue-200",
  IN_REVIEW: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  DONE: "bg-emerald-100 text-emerald-700 border border-emerald-200",
};

export const getInitials = (name?: string | null) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export const getAvatarColor = (seed?: string | null) => {
  const colors = [
    "bg-blue-600",
    "bg-emerald-600",
    "bg-purple-600",
    "bg-pink-600",
    "bg-indigo-600",
    "bg-rose-600",
    "bg-amber-600",
    "bg-teal-600",
  ];
  if (!seed) return colors[0];
  return colors[seed.charCodeAt(0) % colors.length];
};
