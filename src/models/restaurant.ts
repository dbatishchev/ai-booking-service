import { Cuisine } from "./cuisine";

export type OpeningHours = {
  [key: string]: {
    open: string;
    close: string;
  };
}

export type Restaurant = {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  cuisine: Cuisine;
  description: string;
  openingHours: OpeningHours;
  averageRating: number;
  reviewCount: number;
  priceLevel: number;
  latitude: number;
  longitude: number;
  isVerified: boolean;
  createdAt: Date;
};
