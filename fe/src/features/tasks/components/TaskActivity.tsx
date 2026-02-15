import { Activity } from "lucide-react";

type TaskActivityProps = {
  taskId: string;
};

const TaskActivity = ({}: TaskActivityProps) => {
  // This will show audit logs related to this task

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-neutral-600" />
        <h3 className="text-lg font-semibold text-neutral-900">Activity</h3>
      </div>

      <div className="space-y-3">
        {/* Placeholder for activity items */}
        <div className="text-sm text-neutral-500 italic">
          Activity log will appear here...
        </div>
      </div>
    </div>
  );
};

export default TaskActivity;
