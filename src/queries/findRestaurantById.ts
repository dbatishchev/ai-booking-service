import { db } from "@/db";
import { restaurants } from "@/db/schema";
import { Cuisine } from "@/models/cuisine";
import { OpeningHours, Restaurant } from "@/models/restaurant";
import { eq } from "drizzle-orm";

export async function findRestaurantById(id: number): Promise<Restaurant | null> {
  const results = await db
    .select()
    .from(restaurants)
    .where(eq(restaurants.id, id));

  if (results.length === 0) {
    return null;
  }

  const restaurantResults = results.map(r => ({
    ...r,
    cuisine: r.cuisine as Cuisine,
    averageRating: Number(r.averageRating),
    latitude: Number(r.latitude),
    longitude: Number(r.longitude),
    openingHours: r.openingHours as OpeningHours,
  }));

  return restaurantResults[0];
}
