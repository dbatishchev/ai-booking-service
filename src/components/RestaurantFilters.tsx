'use client'

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Cuisine } from "@/models/cuisine";
import { Star, Check } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useQueryState, useQueryStates } from 'nuqs';
import { filtersParsers } from "@/app/restaurants/searchParams";
import { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterState {
  cuisines?: Cuisine[];
  price?: number;
  rating?: number;
  verified?: boolean;
}

export function RestaurantFilters({}) {
  const [
    { cuisines, price, rating, verified },
    setFilters
  ] = useQueryStates(filtersParsers, {
    shallow: false,
  });

  const { control, watch } = useForm<FilterState>({
    defaultValues: { 
      cuisines: cuisines as Cuisine[], 
      price, 
      rating, 
      verified 
    },
  });

  // Watch for form changes and update filters
  useEffect(() => {
    const subscription = watch((value) => {
      setFilters({
        cuisines: value.cuisines as Cuisine[],
        price: value.price,
        rating: value.rating,
        verified: value.verified
      });
    });
    
    return () => subscription.unsubscribe();
  }, [watch, setFilters]);

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Cuisine Filter */}
          <div>
            <h3 className="text-sm font-medium mb-2">Cuisine</h3>
            <Controller
              control={control}
              name="cuisines"
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {Object.values(Cuisine).map((cuisineOption) => (
                    <Badge
                      key={cuisineOption}
                      variant={field.value?.includes(cuisineOption) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        const currentValues = field.value || [];
                        const newValues = currentValues.includes(cuisineOption)
                          ? currentValues.filter(c => c !== cuisineOption)
                          : [...currentValues, cuisineOption];
                        field.onChange(newValues.length > 0 ? newValues : []);
                      }}
                    >
                      {cuisineOption.charAt(0).toUpperCase() + 
                       cuisineOption.slice(1).replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              )}
            />
          </div>

          {/* Price Level Filter */}
          <div>
            <h3 className="text-sm font-medium mb-2">Price Level</h3>
            <Controller
              control={control}
              name="price"
              render={({ field }) => (
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((priceLevel) => (
                    <Badge
                      key={priceLevel}
                      variant={field.value === priceLevel ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => field.onChange(field.value === priceLevel ? 0 : priceLevel)}
                    >
                      {'€'.repeat(priceLevel)}
                    </Badge>
                  ))}
                </div>
              )}
            />
          </div>

          {/* Rating Filter */}
          <div>
            <h3 className="text-sm font-medium mb-2">Minimum Rating</h3>
            <Controller
              control={control}
              name="rating"
              render={({ field }) => (
                <div className="flex gap-2 flex-wrap">
                  {[3, 3.5, 4, 4.5, 4.8].map((ratingValue) => (
                    <Badge
                      key={ratingValue}
                      variant={field.value === ratingValue ? "default" : "outline"}
                      className="cursor-pointer flex items-center gap-1"
                      onClick={() => field.onChange(field.value === ratingValue ? 0 : ratingValue)}
                    >
                      <Star className="w-3 h-3 fill-current" />
                      {ratingValue.toFixed(1)}+
                    </Badge>
                  ))}
                </div>
              )}
            />
          </div>

          {/* Verified Filter */}
          <div>
            <Controller
              control={control}
              name="verified"
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="verified"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <label
                    htmlFor="verified"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Verified restaurants only
                  </label>
                </div>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}