import { pgTable, serial, varchar, text, timestamp, boolean, integer, decimal, jsonb } from 'drizzle-orm/pg-core';

export const restaurants = pgTable('restaurants', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  address: varchar('address', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  website: varchar('website', { length: 255 }).notNull(),
  cuisine: varchar('cuisine', { length: 50 }).notNull(),
  description: text('description').notNull(),
  openingHours: jsonb('opening_hours').notNull(),
  averageRating: decimal('average_rating', { precision: 3, scale: 2 }).notNull(),
  reviewCount: integer('review_count').notNull(),
  priceLevel: integer('price_level').notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 7 }).notNull(),
  longitude: decimal('longitude', { precision: 10, scale: 7 }).notNull(),
  isVerified: boolean('is_verified').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  restaurantId: integer('restaurant_id').references(() => restaurants.id).notNull(),
  date: timestamp('date').notNull(),
  partySize: integer('party_size').notNull(),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  customerEmail: varchar('customer_email', { length: 255 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 50 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('confirmed'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  restaurantId: integer('restaurant_id').references(() => restaurants.id).notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  authorName: varchar('author_name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});