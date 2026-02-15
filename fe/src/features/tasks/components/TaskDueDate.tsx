// import { Calendar, Loader2, X } from "lucide-react";
// import { useState } from "react";
// import { format } from "date-fns";
// import { Button } from "@/components/ui/button";
// import { Calendar as CalendarComponent } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { useUpdateTask } from "../hooks/useUpdateTask";
// import type { Task } from "@/lib/types";

// type TaskDueDateProps = {
//   task: Task;
//   boardId: string;
//   workspaceId: string;
//   listId: string;
// };

// const TaskDueDate = ({
//   task,
//   boardId,
//   workspaceId,
//   listId,
// }: TaskDueDateProps) => {
//   const [open, setOpen] = useState(false);
//   const { mutateAsync: updateTask, isPending } = useUpdateTask();

//   const handleDateChange = async (date: Date | undefined) => {
//     await updateTask({
//       dueDate: date?.toISOString(),
//       boardId,
//       listId,
//       taskId: task.id,
//       workspaceId,
//     });
//     setOpen(false);
//   };

//   const handleRemoveDate = async (e: React.MouseEvent) => {
//     e.stopPropagation();
//     await updateTask({
//       dueDate: null,
//       boardId,
//       listId,
//       taskId: task.id,
//       workspaceId,
//     });
//   };

//   const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
//   const isDueSoon =
//     task.dueDate &&
//     new Date(task.dueDate) > new Date() &&
//     new Date(task.dueDate).getTime() - new Date().getTime() <
//       24 * 60 * 60 * 1000; // Within 24 hours

//   return (
//     <div className="flex items-center justify-between">
//       <span className="text-sm font-medium text-neutral-700">Due Date</span>

//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//           <Button
//             variant="ghost"
//             size="sm"
//             disabled={isPending}
//             className={`${
//               task.dueDate
//                 ? isOverdue
//                   ? "bg-red-100 text-red-600 hover:bg-red-200"
//                   : isDueSoon
//                   ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
//                   : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
//                 : "text-neutral-500"
//             }`}
//           >
//             {isPending ? (
//               <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//             ) : (
//               <Calendar className="w-4 h-4 mr-2" />
//             )}
//             {task.dueDate ? (
//               <Button className="flex items-center gap-2">
//                 {format(new Date(task.dueDate), "MMM dd, yyyy")}
//                 <X
//                   className="w-3 h-3 hover:bg-neutral-300 rounded"
//                   onClick={handleRemoveDate}
//                 />
//               </Button>
//             ) : (
//               "Set date"
//             )}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto p-0" align="end">
//           <CalendarComponent
//             mode="single"
//             selected={task.dueDate ? new Date(task.dueDate) : undefined}
//             onSelect={handleDateChange}
//             initialFocus
//           />
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// };

// export default TaskDueDate;

import { Calendar, Loader2, X } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUpdateTask } from "../hooks/useUpdateTask";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";

type TaskDueDateProps = {
  task: Task;
  boardId: string;
  workspaceId: string;
  listId: string;
};

const TaskDueDate = ({
  task,
  boardId,
  workspaceId,
  listId,
}: TaskDueDateProps) => {
  const [open, setOpen] = useState(false);
  const { mutateAsync: updateTask, isPending } = useUpdateTask();

  const handleDateChange = async (date: Date | undefined) => {
    await updateTask({
      dueDate: date?.toISOString(),
      boardId,
      listId,
      taskId: task.id,
      workspaceId,
    });
    setOpen(false);
  };

  const handleRemoveDate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await updateTask({
      dueDate: null,
      boardId,
      listId,
      taskId: task.id,
      workspaceId,
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  const isDueSoon =
    task.dueDate &&
    new Date(task.dueDate) > new Date() &&
    new Date(task.dueDate).getTime() - new Date().getTime() <
      24 * 60 * 60 * 1000; // Within 24 hours

  return (
    <div>
      <label className="text-xs font-medium text-neutral-500 mb-2 block">
        Due Date
      </label>

      <div className="flex items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={isPending}
              className={cn(
                "flex-1 justify-start font-normal",
                !task.dueDate && "text-neutral-500",
                isOverdue &&
                  "bg-red-50 text-red-600 border-red-200 hover:bg-red-100",
                isDueSoon &&
                  !isOverdue &&
                  "bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100",
                task.dueDate && !isOverdue && !isDueSoon && "bg-neutral-50"
              )}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Calendar className="w-4 h-4 mr-2" />
              )}
              {task.dueDate
                ? format(new Date(task.dueDate), "MMM dd, yyyy")
                : "Set date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <CalendarComponent
              mode="single"
              selected={task.dueDate ? new Date(task.dueDate) : undefined}
              onSelect={handleDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Remove button outside the popover trigger */}
        {task.dueDate && (
          <Button
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={handleRemoveDate}
            className="px-2 hover:bg-red-100 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default TaskDueDate;
