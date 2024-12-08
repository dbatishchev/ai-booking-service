import { RestaurantCard } from "@/components/RestaurantCard";
import { RestaurantMap } from "@/components/RestaurantMap";
import { RestaurantFilters } from "@/components/RestaurantFilters";
import { Restaurant } from "@/models/restaurant";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

interface RestaurantListProps {
  restaurants: Restaurant[];
}

export function RestaurantList({ restaurants }: RestaurantListProps) {
  return (
    <div className="flex gap-8">
      <div className="w-64 flex-shrink-0">
        <div className="sticky top-8">
          <RestaurantFilters />
        </div>
      </div>

      <div className="flex-1">
        {restaurants.length === 0 ? (
          <Card className="w-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No restaurants found</h3>
              <p className="text-sm text-muted-foreground text-center">
                Try adjusting your filters or search criteria
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-8">
              <RestaurantMap restaurants={restaurants} />
            </div>
        
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {restaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} {...restaurant} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
} 