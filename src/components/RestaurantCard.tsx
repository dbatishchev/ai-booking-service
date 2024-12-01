import Link from 'next/link';
import { Star, MapPin, Phone, Globe, Clock, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cuisine } from "@/models/cuisine";

interface OpeningHours {
  [key: string]: {
    open: string;
    close: string;
  };
}

interface RestaurantCardProps {
  id: number;
  name: string;
  address: string;
  phone: string;
  website: string;
  cuisine: Cuisine;
  description: string;
  openingHours: OpeningHours;
  averageRating: number;
  reviewCount: number;
  priceLevel: number;
  isVerified: boolean;
}

export function RestaurantCard({
  id,
  name,
  address,
  phone,
  website,
  cuisine,
  description,
  openingHours,
  averageRating,
  reviewCount,
  priceLevel,
  isVerified,
}: RestaurantCardProps) {
  const priceText = '€'.repeat(priceLevel);
  const hours = openingHours;
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase().slice(0, 3);
  const todayHours = hours[today];

  return (
    <div className="w-full">
      <Link href={`/restaurants/${id}`} className="block w-full">
        <Card className="w-full max-w-2xl hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl">{name}</CardTitle>
                {isVerified && (
                  <Badge variant="secondary">
                    <Check className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <Badge variant="outline" className="text-sm">
                {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
              <span>{averageRating.toFixed(1)}</span>
              <span>({reviewCount} reviews)</span>
              <span className="ml-2 font-medium">{priceText}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <CardDescription className="text-sm">{description}</CardDescription>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{address}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{phone}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span>{website}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>Today: {todayHours.open} - {todayHours.close}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
