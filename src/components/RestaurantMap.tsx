'use client';
import { useEffect, useRef } from 'react';
import { Restaurant } from '@/models/restaurant';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusIcon, MinusIcon, MapPin, X } from "lucide-react";
import { renderToStaticMarkup } from 'react-dom/server';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

interface RestaurantMapProps {
  restaurants: Restaurant[];
  selectedRestaurantId?: number;
}

export function RestaurantMap({ restaurants, selectedRestaurantId }: RestaurantMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const isInitializedRef = useRef(false);

  const handleZoomIn = () => {
    if (googleMapRef.current) {
      googleMapRef.current.setZoom(googleMapRef.current.getZoom()! + 1);
    }
  };

  const handleZoomOut = () => {
    if (googleMapRef.current) {
      googleMapRef.current.setZoom(googleMapRef.current.getZoom()! - 1);
    }
  };

  useEffect(() => {
    if (!mapRef.current || isInitializedRef.current) return;

    // Add style to hide default close button
    const style = document.createElement('style');
    style.textContent = `
      .gm-ui-hover-effect {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    // Calculate initial center point
    const center = restaurants.reduce(
      (acc, restaurant) => ({
        lat: acc.lat + restaurant.latitude / restaurants.length,
        lng: acc.lng + restaurant.longitude / restaurants.length,
      }),
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
        {
          featureType: 'all',
          elementType: 'all',
          stylers: [
            { saturation: -100 },
            { lightness: 10 }
          ]
        }
      ],
      // Hide default controls
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false
    });

    googleMapRef.current = map;
    isInitializedRef.current = true;

    return () => {
      isInitializedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!googleMapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
    }

    // Create markers
    const markers = restaurants.map((restaurant) => {
      const iconSvg = renderToStaticMarkup(
        <MapPin
          size={48}
          fill={selectedRestaurantId === restaurant.id ? '#000000' : '#666666'}
          color="#FFFFFF"
          strokeWidth={2}
        />
      );

      const marker = new google.maps.Marker({
        position: {
          lat: restaurant.latitude,
          lng: restaurant.longitude,
        },
        title: restaurant.name,
        icon: {
          url: `data:image/svg+xml,${encodeURIComponent(iconSvg)}`,
          scaledSize: new google.maps.Size(48, 48),
          anchor: new google.maps.Point(24, 48),
        },
      });

      const closeIconSvg = renderToStaticMarkup(
        <X size={16} strokeWidth={2} />
      );

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-4 min-w-[200px]">
            <div class="flex justify-between items-start">
              <h3 class="text-lg font-semibold mb-2">${restaurant.name}</h3>
              <button class="close-button -mt-2 -mr-2 p-1 hover:bg-gray-100 rounded-full" aria-label="Close">
                ${closeIconSvg}
              </button>
            </div>
            <div class="space-y-1">
              <p class="text-sm text-gray-600">${restaurant.cuisine}</p>
              <div class="flex items-center gap-1">
                <span class="text-sm font-medium">${restaurant.averageRating}</span>
                <span class="text-xs text-gray-500">(${restaurant.reviewCount} reviews)</span>
              </div>
              <p class="text-sm text-gray-600 mt-2">${restaurant.description}</p>
            </div>
          </div>
        `,
        pixelOffset: new google.maps.Size(0, -24),
        maxWidth: 300
      });

      // Add custom close button functionality
      google.maps.event.addListener(infoWindow, 'domready', () => {
        const closeButton = document.querySelector('.close-button');
        if (closeButton) {
          closeButton.addEventListener('click', () => {
            infoWindow.close();
          });
        }
      });

      marker.addListener('click', () => {
        infoWindow.open(googleMapRef.current!, marker);
      });

      markersRef.current.push(marker);
      return marker;
    });

    // Initialize MarkerClusterer
    clustererRef.current = new MarkerClusterer({
      map: googleMapRef.current,
      markers,
      renderer: {
        render: ({ count, position }) => {
          const marker = new google.maps.Marker({
            position,
            icon: {
              url: `data:image/svg+xml,${encodeURIComponent(`
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="32" cy="32" r="32" fill="#000000"/>
                  <text x="32" y="38" text-anchor="middle" fill="white" font-size="24" font-family="Arial">${count}</text>
                </svg>
              `)}`,
              scaledSize: new google.maps.Size(64, 64),
              anchor: new google.maps.Point(32, 32),
            },
            label: '',
            zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
          });
          return marker;
        },
      },
    });

    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
      }
    };
  }, [restaurants, selectedRestaurantId]);

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="w-full h-[400px] rounded-xl shadow-lg"
      />
      
      <Card className="absolute top-4 right-4 p-2 shadow-lg">
        <div className="flex flex-col gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={handleZoomIn}
            aria-label="Zoom in"
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleZoomOut}
            aria-label="Zoom out"
          >
            <MinusIcon className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
} 