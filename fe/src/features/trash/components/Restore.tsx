// import React, { useState } from "react";
// import { RotateCcw, Trash2, MoreVertical } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import type { Board, List } from "@/lib/types";
// import { useRestoreItem } from "../hooks/useRestoreItem";
// import { useDeleteItem } from "../hooks/useDeleteItem";

// interface RestoreProps {
//   item: Board | List;
//   type: "board" | "list";
//   workspaceId: string;
// }

// const Restore: React.FC<RestoreProps> = ({ item, type, workspaceId }) => {
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const [isPopoverOpen, setIsPopoverOpen] = useState(false);

//   const { mutate: restore, isPending: restoring } = useRestoreItem();
//   const { mutate: deletePermanently, isPending: deleting } = useDeleteItem();

//   const handleRestore = () => {
//     restore({ workspaceId, itemId: item.id, type });
//     setIsPopoverOpen(false);
//   };

//   const handleDeletePermanently = () => {
//     deletePermanently({ workspaceId, itemId: item.id, type });
//     setShowDeleteDialog(false);
//     setIsPopoverOpen(false);
//   };

//   return (
//     <>
//       {/* Actions */}
//       <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
//         <PopoverTrigger asChild>
//           <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
//             <MoreVertical className="h-4 w-4" />
//           </Button>
//         </PopoverTrigger>

//         <PopoverContent className="w-56 p-2" align="end">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={handleRestore}
//             disabled={restoring || deleting}
//             className="justify-start w-full"
//           >
//             <RotateCcw className="h-4 w-4 mr-2" />
//             {restoring ? "Restoring..." : "Restore"}
//           </Button>

//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => setShowDeleteDialog(true)}
//             disabled={restoring || deleting}
//             className="justify-start w-full text-red-500 hover:text-red-600 hover:bg-red-50"
//           >
//             <Trash2 className="h-4 w-4 mr-2" />
//             Delete permanently
//           </Button>
//         </PopoverContent>
//       </Popover>

//       {/* Confirmation dialog */}
//       <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Delete permanently?</DialogTitle>
//             <DialogDescription>
//               This will permanently delete <strong>{item.title}</strong>. This
//               action cannot be undone.
//             </DialogDescription>
//           </DialogHeader>

//           <DialogFooter className="gap-2">
//             <Button
//               variant="outline"
//               onClick={() => setShowDeleteDialog(false)}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleDeletePermanently}
//               disabled={deleting}
//               className="bg-red-500 hover:bg-red-600"
//             >
//               {deleting ? "Deleting..." : "Delete permanently"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default Restore;

import React, { useState } from "react";
import { RotateCcw, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Board, List, Task } from "@/lib/types";
import { useRestoreItem } from "../hooks/useRestoreItem";
import { useDeleteItem } from "../hooks/useDeleteItem";

interface RestoreProps {
  item: Board | List | Task;
  type: "board" | "list" | "task";
  workspaceId: string;
  boardId?: string;
  listId?: string;
  taskId?: string;
}

const Restore: React.FC<RestoreProps> = ({
  item,
  type,
  workspaceId,
  boardId,
  listId,
  taskId,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const { mutate: restore, isPending: restoring } = useRestoreItem();
  const { mutate: deletePermanently, isPending: deleting } = useDeleteItem();

  const handleRestore = () => {
    restore({
      workspaceId,
      itemId: item.id,
      type,
      boardId,
      listId,
      taskId,
    });
    setIsPopoverOpen(false);
  };

  const handleDeletePermanently = () => {
    deletePermanently({
      workspaceId,
      itemId: item.id,
      type,
      boardId,
      listId,
      taskId,
    });
    setShowDeleteDialog(false);
    setIsPopoverOpen(false);
  };

  return (
    <>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-56 p-2" align="end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRestore}
            disabled={restoring || deleting}
            className="justify-start w-full"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            {restoring ? "Restoring..." : "Restore"}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            disabled={restoring || deleting}
            className="justify-start w-full text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete permanently
          </Button>
        </PopoverContent>
      </Popover>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete permanently?</DialogTitle>
            <DialogDescription>
              This will permanently delete{" "}
              <strong>{"title" in item ? item.title : "this item"}</strong>.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeletePermanently}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleting ? "Deleting..." : "Delete permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Restore;
