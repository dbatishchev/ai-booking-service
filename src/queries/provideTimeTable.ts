import { db } from "@/db";
import { restaurants } from "@/db/schema";
import { TimeSlot } from "@/models/timeTable";
import { eq } from "drizzle-orm";

type ProvideTimeTableParams = {
  restaurantId: number;
  date: string;
  partySize: number;
};

type ProvideTimeTableResult = {
  restaurantName: string;
  date: string;
  timeSlots: TimeSlot[];
};

export async function provideTimeTable({ 
  restaurantId, 
  date, 
  partySize 
}: ProvideTimeTableParams): Promise<ProvideTimeTableResult> {
  // Find the restaurant using Drizzle
  const [restaurant] = await db
    .select()
    .from(restaurants)
    .where(eq(restaurants.id, restaurantId));

  if (!restaurant) {
    throw new Error(`Restaurant with ID ${restaurantId} not found`);
  }

  // Parse the opening hours
  const hours = restaurant.openingHours as Record<string, { open: string; close: string }>;
  
  // Get day of week from date (mon, tue, etc.)
  const dayOfWeek = new Date(date)
    .toLocaleDateString('en-US', { weekday: 'short' })
    .toLowerCase()
    .slice(0, 3);
  
  // Get opening hours for the specified day
  const dayHours = hours[dayOfWeek];
  if (!dayHours) {
    throw new Error(`Invalid day of week: ${dayOfWeek}`);
  }

  // Generate time slots every 30 minutes between opening and closing time
  const timeSlots: TimeSlot[] = [];
  const [openHour, openMinute] = dayHours.open.split(':').map(Number);
  const [closeHour, closeMinute] = dayHours.close.split(':').map(Number);
  
  let currentHour = openHour;
  let currentMinute = openMinute;

  while (
    currentHour < closeHour || 
    (currentHour === closeHour && currentMinute <= closeMinute - 30)
  ) {
    // Format time as HH:MM
    const time = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
    
    // TODO: Check bookings table for actual availability
    // For now, we'll simulate availability based on random chance and party size
    const available = Math.random() > 0.3 && partySize <= 8;

    timeSlots.push({ time, available });

    // Increment by 30 minutes
    currentMinute += 30;
    if (currentMinute >= 60) {
      currentHour += 1;
      currentMinute = 0;
    }
  }

  return {
    restaurantName: restaurant.name,
    date,
    timeSlots,
  };
}
