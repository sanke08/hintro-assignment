import { XCircle } from "lucide-react";

interface ErrorFieldProps {
  errorStr?: string;
}

const ErrorField = ({ errorStr }: ErrorFieldProps) => {
  if (!errorStr) return null;

  return (
    <div className="flex items-center gap-x-2 text-sm text-rose-500 bg-rose-500/10 p-3 rounded-md mt-2">
      <XCircle className="h-4 w-4" />
      <p>{errorStr}</p>
    </div>
  );
};

export default ErrorField;
