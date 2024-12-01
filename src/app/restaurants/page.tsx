import { RestaurantCard } from "@/components/RestaurantCard";
import { RestaurantMap } from "@/components/RestaurantMap";
import { findRestaurants } from "@/queries/findRestaurants";

export default async function RestaurantsPage() {
  const restaurants = await findRestaurants({});

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">All Restaurants</h1>
      
      <div className="mb-8">
        <RestaurantMap restaurants={restaurants} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} {...restaurant} />
        ))}
      </div>
    </div>
  );
}
