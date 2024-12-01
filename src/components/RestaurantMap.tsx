'use client';
import { useEffect, useRef } from 'react';
import { Restaurant } from '@/models/restaurant';

interface RestaurantMapProps {
  restaurants: Restaurant[];
  selectedRestaurantId?: number;
}

export function RestaurantMap({ restaurants, selectedRestaurantId }: RestaurantMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Calculate center point from all restaurant coordinates
    const center = restaurants.reduce(
      (acc, restaurant) => {
        return {
          lat: acc.lat + restaurant.latitude / restaurants.length,
          lng: acc.lng + restaurant.longitude / restaurants.length,
        };
      },
      { lat: 0, lng: 0 }
    );

    // Initialize map
    const map = new google.maps.Map(mapRef.current, {
      center,
      zoom: 13,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
    });

    googleMapRef.current = map;

    // Add markers for each restaurant
    restaurants.forEach((restaurant) => {
      const marker = new google.maps.Marker({
        position: {
          lat: restaurant.latitude,
          lng: restaurant.longitude,
        },
        map,
        title: restaurant.name,
        animation: selectedRestaurantId === restaurant.id 
          ? google.maps.Animation.BOUNCE 
          : undefined,
      });

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-bold">${restaurant.name}</h3>
            <p class="text-sm">${restaurant.cuisine}</p>
            <p class="text-sm">Rating: ${restaurant.averageRating} (${restaurant.reviewCount} reviews)</p>
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [restaurants, selectedRestaurantId]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-[400px] rounded-xl shadow-lg"
    />
  );
} 