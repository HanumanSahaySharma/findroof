import { Skeleton } from "../ui/skeleton";

export default function SkeletonProerty() {
  return (
    <div className="grid grid-cols-12 gap-8 mb-20">
      <div className="col-span-4">
        <Skeleton className="w-full h-[240px] rounded-md"></Skeleton>
      </div>
      <div className="col-span-8 flex">
        <div className="flex-1">
          <Skeleton className="h-8 w-full mb-4"></Skeleton>
          <Skeleton className="h-5 w-full max-w-[400px] mb-10"></Skeleton>
          <div className="flex items-center gap-4 mb-10">
            <div className="flex items-center gap-2">
              <Skeleton className="w-10 h-10 rounded-full"></Skeleton>
              <Skeleton className="w-16 h-5"></Skeleton>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-10 h-10 rounded-full"></Skeleton>
              <Skeleton className="w-16 h-5"></Skeleton>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-10 h-10 rounded-full"></Skeleton>
              <Skeleton className="w-16 h-5"></Skeleton>
            </div>
          </div>
          <Skeleton className="h-6 w-full max-w-[800px] mb-10"></Skeleton>
          <Skeleton className="w-16 h-10 ml-auto"></Skeleton>
        </div>
      </div>
    </div>
  );
}
