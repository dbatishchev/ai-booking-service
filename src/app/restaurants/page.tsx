import { findRestaurants } from "@/queries/findRestaurants";
import { RestaurantList } from "@/components/RestaurantList";
import { parseAsFloat } from "nuqs/server";
import { parseAsInteger } from "nuqs/server";
import { parseAsString } from "nuqs/server";
import { searchParamsCache } from './searchParams'
import { SearchParams } from "nuqs/server";
import { Cuisine } from "@/models/cuisine";

interface PageProps {
    searchParams: Promise<SearchParams> // Next.js 15+: async searchParams prop
}

export default async function RestaurantsPage({ searchParams }: PageProps) {
  const { cuisines, price, rating, verified } = await searchParamsCache.parse(searchParams);

  const { restaurants, total } = await findRestaurants({
    cuisines: cuisines as Cuisine[],
    priceLevel: price,
    minRating: rating,
    isVerified: verified,
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">
        All Restaurants
        <span className="text-lg font-normal text-muted-foreground ml-4">
          {total} results
        </span>
      </h1>
      <RestaurantList 
        restaurants={restaurants} 
      />
    </div>
  );
}
