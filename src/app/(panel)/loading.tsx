import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-3 text-primary">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="text-sm font-medium text-gray-500">Yükleniyor...</p>
      </div>
    </div>
  );
}