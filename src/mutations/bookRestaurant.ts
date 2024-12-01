import { db } from "@/db";
import { bookings } from "@/db/schema";
import { findRestaurantById } from "@/queries/findRestaurantById";

type BookRestaurantParams = {
  restaurantId: number;
  date: string;
  time: string;
  partySize: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
};

export async function bookRestaurant({
  restaurantId,
  date,
  time,
  partySize,
  customerName,
  customerEmail,
  customerPhone,
}: BookRestaurantParams) {
  // Check if restaurant exists
  const restaurant = await findRestaurantById(restaurantId);
  if (!restaurant) {
    throw new Error(`Restaurant with ID ${restaurantId} not found`);
  }

  // Parse date and time into a single Date object
  const [hours, minutes] = time.split(':').map(Number);
  const bookingDate = new Date(date);
  bookingDate.setHours(hours, minutes);

  // Get day of week for checking opening hours
  const dayOfWeek = bookingDate
    .toLocaleDateString('en-US', { weekday: 'short' })
    .toLowerCase()
    .slice(0, 3);

  // Check if restaurant is open at the requested time
  const dayHours = restaurant.openingHours[dayOfWeek];
  if (!dayHours) {
    throw new Error('Invalid day of week');
  }

  const [openHour, openMinute] = dayHours.open.split(':').map(Number);
  const [closeHour, closeMinute] = dayHours.close.split(':').map(Number);
  const openTime = openHour * 60 + openMinute;
  const closeTime = closeHour * 60 + closeMinute;
  const bookingTime = hours * 60 + minutes;

  if (bookingTime < openTime || bookingTime > closeTime - 30) {
    throw new Error('Restaurant is closed at the requested time');
  }

  // TODO: Check existing bookings to prevent overbooking
  // This would require implementing a capacity system and checking current bookings
  
  try {
    // Insert the booking
    const [booking] = await db.insert(bookings).values({
      restaurantId,
      date: bookingDate,
      partySize,
      customerName,
      customerEmail,
      customerPhone,
      status: 'confirmed',
    }).returning();

    return {
      success: true,
      bookingId: booking.id,
      restaurantId,
      date,
      time,
      partySize,
    };
  } catch (error) {
    console.error('Failed to create booking:', error);
    return {
      success: false,
      restaurantId,
      date,
      time,
      partySize,
    };
  }
}
