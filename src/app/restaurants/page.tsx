import { findRestaurants } from "@/queries/findRestaurants";
import { RestaurantList } from "@/components/RestaurantList";
import { filtersSearchParamsCache } from './searchParams';
import { SearchParams } from "nuqs/server";
import { Cuisine } from "@/models/cuisine";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";

const ITEMS_PER_PAGE = 10;

interface PageProps {
    searchParams: Promise<SearchParams> // Next.js 15+: async searchParams prop
}

export default async function RestaurantsPage({ searchParams }: PageProps) {
  const { cuisines, price, rating, verified } = await filtersSearchParamsCache.parse(searchParams);

  const { restaurants, total } = await findRestaurants({
    cuisines: cuisines as Cuisine[],
    priceLevel: price,
    minRating: rating,
    isVerified: verified,
    limit: ITEMS_PER_PAGE,
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">
        All Restaurants
        <span className="text-lg font-normal text-muted-foreground ml-4">
          {total} results
        </span>
      </h1>

      <ReactQueryProvider>
        <RestaurantList initialRestaurants={restaurants} filters={{ cuisines, price, rating, verified }} />
      </ReactQueryProvider>
    </div>
  );
}
