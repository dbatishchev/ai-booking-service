import { notFound } from "next/navigation";
import { MapPin, Phone, Globe, Clock, Star, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RestaurantMap } from "@/components/RestaurantMap";
import { findRestaurantById } from "@/queries/findRestaurantById";

interface RestaurantPageProps {
  params: {
    id: string;
  };
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const restaurant = await findRestaurantById(parseInt(params.id));
  
  if (!restaurant) {
    notFound();
  }

  const hours = restaurant.openingHours;
  const priceText = '€'.repeat(restaurant.priceLevel);

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-3xl">{restaurant.name}</CardTitle>
              {restaurant.isVerified && (
                <Badge variant="secondary">
                  <Check className="w-4 h-4 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            <Badge variant="outline" className="text-lg">
              {restaurant.cuisine.charAt(0).toUpperCase() + restaurant.cuisine.slice(1)}
            </Badge>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <Star className="w-5 h-5 fill-yellow-400 stroke-yellow-400" />
            <span className="text-lg">{restaurant.averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground">({restaurant.reviewCount} reviews)</span>
            <span className="ml-4 font-medium text-lg">{priceText}</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-lg">{restaurant.description}</p>

          <div className="grid gap-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <span>{restaurant.address}</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <span>{restaurant.phone}</span>
            </div>

            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-muted-foreground" />
              <a 
                href={`https://${restaurant.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {restaurant.website}
              </a>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Opening Hours</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(hours).map(([day, times]: [string, any]) => (
                  <div key={day} className="flex justify-between p-2 rounded bg-muted">
                    <span className="capitalize">{day}</span>
                    <span>{times.open} - {times.close}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Location</h2>
              <RestaurantMap 
                restaurants={[restaurant]} 
                selectedRestaurantId={restaurant.id}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
