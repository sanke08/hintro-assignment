import { CheckCircle } from "lucide-react";

interface SuccessFieldProps {
  successStr?: string;
}

const SuccessField = ({ successStr }: SuccessFieldProps) => {
  if (!successStr) return null;

  return (
    <div className="flex items-center gap-x-2 text-sm text-emerald-500 bg-emerald-500/10 p-3 rounded-md mt-2">
      <CheckCircle className="h-4 w-4" />
      <p>{successStr}</p>
    </div>
  );
};

export default SuccessField;
