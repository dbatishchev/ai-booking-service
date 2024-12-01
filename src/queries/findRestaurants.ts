'use server';

import { db } from "@/db";
import { restaurants } from "@/db/schema";
import { Cuisine } from "@/models/cuisine";
import { OpeningHours, Restaurant } from "@/models/restaurant";
import { and, eq, gte, sql } from "drizzle-orm";
import { SQL } from 'drizzle-orm';

type FindRestaurantsParams = {
  cuisine?: Cuisine;
  priceLevel?: number;
  minRating?: number;
  isVerified?: boolean;
  openNow?: boolean;
  maxDistance?: number;
  location?: {
    latitude: number;
    longitude: number;
  };
  sortBy?: 'rating' | 'price' | 'distance' | 'reviewCount';
  limit?: number;
};

export async function findRestaurants(params: FindRestaurantsParams = {}): Promise<Restaurant[]> {
  let query = db.select().from(restaurants);
  const conditions: SQL[] = [];

  // Apply filters
  if (params.cuisine) {
    conditions.push(eq(restaurants.cuisine, params.cuisine));
  }

  if (params.priceLevel) {
    conditions.push(eq(restaurants.priceLevel, params.priceLevel));
  }

  if (params.minRating) {
    conditions.push(gte(sql<number>`${restaurants.averageRating}::numeric`, params.minRating));
  }

  if (params.isVerified) {
    conditions.push(eq(restaurants.isVerified, true));
  }

  if (params.openNow) {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase().slice(0, 3);
    const currentTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    // Using PostgreSQL JSONB operators to check opening hours
    conditions.push(sql`${restaurants.openingHours}->>${currentDay}->>'open' <= ${currentTime}`);
    conditions.push(sql`${restaurants.openingHours}->>${currentDay}->>'close' >= ${currentTime}`);
  }

  if (params.location && params.maxDistance) {
    // Haversine formula in PostgreSQL
    const distanceFormula = sql`
      6371 * acos(
        cos(radians(${params.location.latitude})) * 
        cos(radians(${restaurants.latitude})) * 
        cos(radians(${restaurants.longitude}) - radians(${params.location.longitude})) + 
        sin(radians(${params.location.latitude})) * 
        sin(radians(${restaurants.latitude}))
      )
    `;

    conditions.push(sql`${distanceFormula} <= ${params.maxDistance}`);
  }

  // Apply all conditions
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as typeof query;
  }

  // Apply sorting
  if (params.sortBy) {
    switch (params.sortBy) {
      case 'rating':
        query = query.orderBy(restaurants.averageRating) as typeof query;
        break;
      case 'price':
        query = query.orderBy(restaurants.priceLevel) as typeof query;
        break;
      case 'reviewCount':
        query = query.orderBy(restaurants.reviewCount) as typeof query;
        break;
      case 'distance':
        if (params.location) {
          // Sort by distance using Haversine formula
          const distanceFormula = sql`
            6371 * acos(
              cos(radians(${params.location.latitude})) * 
              cos(radians(${restaurants.latitude})) * 
              cos(radians(${restaurants.longitude}) - radians(${params.location.longitude})) + 
              sin(radians(${params.location.latitude})) * 
              sin(radians(${restaurants.latitude}))
            )
          `;
          query = query.orderBy(distanceFormula) as typeof query;
        }
        break;
    }
  }

  // Apply limit
  if (params.limit) {
    query = query.limit(params.limit) as typeof query;
  }

  const result = await query;

  const restaurantResults = result.map(r => ({
    ...r,
    cuisine: r.cuisine as Cuisine,
    averageRating: Number(r.averageRating),
    latitude: Number(r.latitude),
    longitude: Number(r.longitude),
    openingHours: r.openingHours as OpeningHours,
  }));

  return restaurantResults;
}
