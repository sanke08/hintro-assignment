// import { useState } from "react";
// import { Plus, X } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

// import { useAddList } from "../hooks/useAddList";
// import {
//   createListSchema,
//   type CreateListInput,
// } from "../schemas/lists.schema";

// const AddList = ({
//   boardId,
//   workspaceId,
// }: {
//   boardId: string;
//   workspaceId: string;
// }) => {
//   const [open, setOpen] = useState(false);

//   const { mutateAsync, isPending } = useAddList();

//   const form = useForm<CreateListInput>({
//     resolver: zodResolver(createListSchema),
//     defaultValues: {
//       title: "",
//       boardId,
//     },
//   });

//   const handleSubmit = async (values: CreateListInput) => {
//     await mutateAsync({ ...values, workspaceId });
//     form.reset();
//     setOpen(false);
//   };

//   return (
//     <div className="min-w-[260px]">
//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger className="gap-2 flex  items-center p-3 px-6 bg-neutral-900 rounded-md text-white w-full">
//           <Plus size={16} />
//           Add another list
//         </PopoverTrigger>

//         <PopoverContent className="w-[260px] p-3" align="start" side="bottom">
//           <form
//             onSubmit={form.handleSubmit(handleSubmit)}
//             className="space-y-2"
//           >
//             <Input
//               placeholder="Enter list title"
//               {...form.register("title")}
//               autoFocus
//             />

//             {form.formState.errors.title && (
//               <p className="text-sm text-red-500">
//                 {form.formState.errors.title.message}
//               </p>
//             )}

//             <div className="flex justify-end gap-2">
//               <Button type="submit" isLoading={isPending} size="sm">
//                 Add list
//               </Button>
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => setOpen(false)}
//               >
//                 <X size={16} />
//               </Button>
//             </div>
//           </form>
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// };

// export default AddList;

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useAddList } from "../hooks/useAddList";
import {
  createListSchema,
  type CreateListInput,
} from "../schemas/lists.schema";

const AddList = ({
  boardId,
  workspaceId,
}: {
  boardId: string;
  workspaceId: string;
}) => {
  const [open, setOpen] = useState(false);

  const { mutateAsync, isPending } = useAddList();

  const form = useForm<CreateListInput>({
    resolver: zodResolver(createListSchema),
    defaultValues: {
      title: "",
      boardId,
      workspaceId,
    },
  });

  const handleSubmit = async (values: CreateListInput) => {
    await mutateAsync({ ...values, workspaceId });
    form.reset();
    setOpen(false);
  };

  return (
    <div className="min-w-[260px] snap-start">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="gap-2 flex items-center p-3 px-6 w-full">
            <Plus size={16} />
            Add another list
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[260px] p-3" align="start" side="bottom">
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-2"
          >
            <Input
              placeholder="Enter list title"
              {...form.register("title")}
              autoFocus
            />

            {form.formState.errors.title && (
              <p className="text-sm text-red-500">
                {form.formState.errors.title.message}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <Button type="submit" isLoading={isPending} size="sm">
                Add list
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <X size={16} />
              </Button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AddList;
