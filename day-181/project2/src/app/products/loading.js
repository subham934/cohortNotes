
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const Loading = () => {
  return (
    <div className="min-h-screen bg-background p-8">

      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

        {Array.from({ length: 8 }).map((_, index) => (
          <Card
            key={index}
            className="w-full overflow-hidden shadow-sm"
          >

            {/* Product Image Skeleton */}
            <div className="flex h-64 items-center justify-center bg-muted p-6">
              <Skeleton className="h-full w-full rounded-lg" />
            </div>

            {/* Product Details Skeleton */}
            <CardContent className="space-y-4 p-5">

              {/* Category */}
              <Skeleton className="h-4 w-28" />

              {/* Product Title */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-24" />
              </div>

              {/* Price and Add to Cart */}
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-10 w-28 rounded-md" />
              </div>

            </CardContent>
          </Card>
        ))}

      </div>
    </div>
  );
};

export default Loading;
