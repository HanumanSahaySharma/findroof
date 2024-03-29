import { LucideLoader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="bg-slate-200 p-2 flex items-center justify-center rounded-md w-12 h-12 mx-auto mb-10">
      <LucideLoader2 size={40} className="animate-spin w-10 text-red-600" />
      <span className="hidden" aria-label="loading">
        Loading...
      </span>
    </div>
  );
}
