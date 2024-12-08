'use server';

import { Cuisine } from "@/models/cuisine";
import { findRestaurants } from "@/queries/findRestaurants";

export async function fetchNextPage(
    page: number,
    cuisines: Cuisine[],
    price: number,
    rating: number,
    verified: boolean
  ) {
    
    const { restaurants } = await findRestaurants({
      cuisines,
      priceLevel: price,
      minRating: rating,
      isVerified: verified,
      limit: 10,
      page,
    });
  
    return restaurants;
  }
  