// import React from "react";
// import { useParams } from "react-router-dom";
// import { Trash2 } from "lucide-react";
// import { useGetTrashedItems } from "@/features/trash/hooks/useGetTrashedItems";
// import Restore from "../components/Restore";

// const TrashPage: React.FC = () => {
//   const { workspaceId } = useParams<{ workspaceId: string }>();

//   const { data: trashedItems, isLoading: trashLoading } = useGetTrashedItems({
//     workspaceId: workspaceId!,
//   });

//   // Loading state
//   if (trashLoading) {
//     return <TrashSkeleton />;
//   }

//   const hasItems =
//     (trashedItems?.boards?.length || 0) + (trashedItems?.lists?.length || 0) >
//     0;

//   return (
//     <div className="w-full">
//       {/* Header */}
//       <div className="px-5 pt-5 pb-2">
//         <div className="flex items-center gap-2 text-2xl font-semibold">
//           <Trash2 className="w-6 h-6" />
//           <h1>Trash</h1>
//         </div>
//         <p className="text-neutral-500 text-sm mt-1">
//           Restore or permanently delete items
//         </p>
//       </div>

//       {/* Empty state */}
//       {!hasItems && (
//         <div className="flex flex-col items-center justify-center w-full mt-20">
//           <Trash2 className="w-16 h-16 text-neutral-400 mb-4" />
//           <p className="capitalize text-3xl text-neutral-500">
//             No items in trash
//           </p>
//         </div>
//       )}

//       {/* Trashed items grid */}
//       {hasItems && (
//         <div className="p-5 pt-2 grid grid-cols-1 md:grid-cols-2 gap-5">
//           {/* Trashed Lists */}
//           {trashedItems?.lists?.map((list) => (
//             <div
//               key={list.id}
//               className="border px-5 p-3 rounded-lg flex justify-between items-center hover:shadow-md transition-shadow"
//             >
//               <div className="flex-1">
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
//                     List
//                   </span>
//                   <p className="text-xl font-medium">{list.title}</p>
//                 </div>
//                 <p className="text-neutral-500 text-xs mt-1">
//                   Deleted on {new Date(list.updatedAt).toLocaleDateString()}
//                 </p>
//                 <p className="text-neutral-400 text-xs">
//                   Created {new Date(list.createdAt).toLocaleDateString()}
//                 </p>
//               </div>
//               <Restore item={list} type="list" workspaceId={workspaceId!} />
//             </div>
//           ))}

//           {/* Trashed Boards */}
//           {trashedItems?.boards?.map((board) => (
//             <div
//               key={board.id}
//               className="border px-5 p-3 rounded-lg flex justify-between items-center hover:shadow-md transition-shadow"
//             >
//               <div className="flex-1">
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
//                     Board
//                   </span>
//                   <p className="text-xl font-medium">{board.title}</p>
//                 </div>
//                 <p className="text-neutral-500 text-xs mt-1">
//                   Deleted on {new Date(board.updatedAt).toLocaleDateString()}
//                 </p>
//                 <p className="text-neutral-400 text-xs">
//                   Created {new Date(board.createdAt).toLocaleDateString()}
//                 </p>
//               </div>
//               <Restore item={board} type="board" workspaceId={workspaceId!} />
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// // Loading skeleton component
// const TrashSkeleton: React.FC = () => {
//   return (
//     <div className="w-full p-5">
//       <div className="mb-5">
//         <div className="h-8 w-32 bg-neutral-200 animate-pulse rounded" />
//         <div className="h-4 w-48 bg-neutral-200 animate-pulse rounded mt-2" />
//       </div>
//       {[...Array(5)].map((_, index) => (
//         <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
//           <div className="py-8 bg-neutral-200 animate-pulse w-full rounded-lg" />
//           <div className="py-8 bg-neutral-200 animate-pulse w-full rounded-lg" />
//         </div>
//       ))}
//     </div>
//   );
// };

// export default TrashPage;

import React from "react";
import { useParams } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useGetTrashedItems } from "@/features/trash/hooks/useGetTrashedItems";
import Restore from "../components/Restore";

const TrashPage: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const { data: trashedItems, isLoading: trashLoading } = useGetTrashedItems({
    workspaceId: workspaceId!,
  });

  if (trashLoading) {
    return <TrashSkeleton />;
  }
  console.log({ trashedItems });
  const hasItems =
    (trashedItems?.boards?.length || 0) +
      (trashedItems?.lists?.length || 0) +
      (trashedItems?.tasks?.length || 0) >
    0;

  return (
    <div className="w-full">
      <div className="px-5 pt-5 pb-2">
        <div className="flex items-center gap-2 text-2xl font-semibold">
          <Trash2 className="w-6 h-6" />
          <h1>Trash</h1>
        </div>
        <p className="text-neutral-500 text-sm mt-1">
          Restore or permanently delete items
        </p>
      </div>

      {!hasItems && (
        <div className="flex flex-col items-center justify-center w-full mt-20">
          <Trash2 className="w-16 h-16 text-neutral-400 mb-4" />
          <p className="capitalize text-3xl text-neutral-500">
            No items in trash
          </p>
        </div>
      )}

      {hasItems && (
        <div className="p-5 pt-2 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Tasks */}
          {trashedItems?.tasks?.map((task) => (
            <div
              key={task.id}
              className="border px-5 p-3 rounded-lg flex justify-between items-center hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    Task
                  </span>
                  <p className="text-xl font-medium">{task.title}</p>
                </div>
                <p className="text-neutral-500 text-xs mt-1">
                  Deleted on {new Date(task.updatedAt).toLocaleDateString()}
                </p>
                <p className="text-neutral-400 text-xs">
                  Created {new Date(task.createdAt).toLocaleDateString()}
                </p>
              </div>

              <Restore
                item={task}
                type="task"
                workspaceId={workspaceId!}
                boardId={task.list?.boardId}
                listId={task.listId}
                taskId={task.id}
              />
            </div>
          ))}

          {/* Lists */}
          {trashedItems?.lists?.map((list) => (
            <div
              key={list.id}
              className="border px-5 p-3 rounded-lg flex justify-between items-center hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    List
                  </span>
                  <p className="text-xl font-medium">{list.title}</p>
                </div>
                <p className="text-neutral-500 text-xs mt-1">
                  Deleted on {new Date(list.updatedAt).toLocaleDateString()}
                </p>
                <p className="text-neutral-400 text-xs">
                  Created {new Date(list.createdAt).toLocaleDateString()}
                </p>
              </div>

              <Restore
                item={list}
                type="list"
                workspaceId={workspaceId!}
                boardId={list.boardId}
              />
            </div>
          ))}

          {/* Boards */}
          {trashedItems?.boards?.map((board) => (
            <div
              key={board.id}
              className="border px-5 p-3 rounded-lg flex justify-between items-center hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    Board
                  </span>
                  <p className="text-xl font-medium">{board.title}</p>
                </div>
                <p className="text-neutral-500 text-xs mt-1">
                  Deleted on {new Date(board.updatedAt).toLocaleDateString()}
                </p>
                <p className="text-neutral-400 text-xs">
                  Created {new Date(board.createdAt).toLocaleDateString()}
                </p>
              </div>

              <Restore item={board} type="board" workspaceId={workspaceId!} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TrashSkeleton: React.FC = () => {
  return (
    <div className="w-full p-5">
      <div className="mb-5">
        <div className="h-8 w-32 bg-neutral-200 animate-pulse rounded" />
        <div className="h-4 w-48 bg-neutral-200 animate-pulse rounded mt-2" />
      </div>

      {[...Array(5)].map((_, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div className="py-8 bg-neutral-200 animate-pulse w-full rounded-lg" />
          <div className="py-8 bg-neutral-200 animate-pulse w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
};

export default TrashPage;
