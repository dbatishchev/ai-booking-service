import { Cuisine } from '@/models/cuisine';
import { ToolName } from '@/models/tools';
import { bookRestaurant } from '@/mutations/bookRestaurant';
import { findRestaurants } from '@/queries/findRestaurants';
import { provideTimeTable } from '@/queries/provideTimeTable';
import { openai } from '@ai-sdk/openai';
import { currentUser } from '@clerk/nextjs/server';
import { streamText, tool } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    system: 'You are a friendly assistant!',
    messages,
    tools: {
      [ToolName.FindRestaurants]: tool({
        description: 'Find restaurants based on various criteria',
        parameters: z.object({
          cuisine: z.enum(Object.values(Cuisine) as [string, ...string[]]).optional()
            .transform(val => val as Cuisine)
            .describe('The type of cuisine'),
          priceLevel: z.number().min(1).max(4).optional()
            .describe('Price level from 1 ($) to 4 ($$$$)'),
          minRating: z.number().min(0).max(5).optional()
            .describe('Minimum average rating (0-5)'),
          isVerified: z.boolean().optional()
            .describe('Filter for verified restaurants only'),
          openNow: z.boolean().optional()
            .describe('Filter for currently open restaurants'),
          maxDistance: z.number().optional()
            .describe('Maximum distance in kilometers from specified location'),
          location: z.object({
            latitude: z.number(),
            longitude: z.number(),
          }).optional()
            .describe('Center point for distance-based search'),
          sortBy: z.enum(['rating', 'price', 'distance', 'reviewCount']).optional()
            .describe('Sort results by specified criteria'),
          limit: z.number()
            .min(1)
            .max(10)
            .default(2)
            .describe('Limit the number of results'),
        }),
        execute: async ({ cuisine, priceLevel, minRating, isVerified, openNow, maxDistance, location, sortBy, limit }) => {
          const result = await findRestaurants({
            cuisine,
            priceLevel,
            minRating,
            isVerified,
            openNow,
            maxDistance,
            location,
            sortBy,
          });
          return result;
        },
      }),
      [ToolName.BookTable]: tool({
        description: 'Book a table at a restaurant',
        parameters: z.object({
          restaurantId: z.number().describe('The ID of the restaurant to book a table at'),
          date: z.string().describe('The date of the booking'),
          time: z.string().describe('The time of the booking'),
          partySize: z.number().describe('The number of people in the party'),
        }),
        execute: async ({ restaurantId, date, time, partySize }) => {
          const user = await currentUser();
          
          if (!user) {
            return new Response('Unauthorized', { status: 401 });
          }

          const customerName = `${user.firstName} ${user.lastName}`.trim() || user.username || 'Anonymous';
          const customerEmail = user.emailAddresses[0]?.emailAddress;
          const customerPhone = user.phoneNumbers[0]?.phoneNumber || '';

          if (!customerEmail) {
            throw new Error('User email not found');
          }

          const result = await bookRestaurant({ 
            restaurantId, 
            date, 
            time, 
            partySize,
            customerName,
            customerEmail,
            customerPhone,
          });
          return result;
        },
      }),
      [ToolName.CancelBooking]: tool({
        description: 'Cancel a booking at a restaurant',
        parameters: z.object({
          bookingId: z.number().describe('The ID of the booking to cancel'),
        }),
        execute: async ({ bookingId }) => {
          // TODO: Implement cancellation logic
          return { success: true };
        },
      }),
      [ToolName.ProvideTimeTable]: tool({
        description: 'Provide the time table of a restaurant',
        parameters: z.object({
          restaurantId: z.number().describe('The ID of the restaurant to check booking availability at'),
          date: z.string().describe('The date of the booking'),
          partySize: z.number().describe('The number of people in the party'),
        }),
        execute: async ({ restaurantId, date, partySize }) => {
          const result = await provideTimeTable({ restaurantId, date, partySize });
          return result;
        },
      }),
      [ToolName.ProvideRestaurantInfo]: tool({
        description: 'Provide information about a restaurant',
        parameters: z.object({
          restaurantId: z.number().describe('The ID of the restaurant to provide information about'),
        }),
        execute: async ({ restaurantId }) => {
          // TODO: Implement information retrieval logic
          return { info: 'Information about the restaurant' };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}