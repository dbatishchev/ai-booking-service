import { useInfiniteQuery } from '@tanstack/react-query';
import { Restaurant } from '@/models/restaurant';
import { Cuisine } from '@/models/cuisine';
import { fetchNextPage } from '@/actions/fetchNextPage';

export function useRestaurants(
  initialData: Restaurant[],
  cuisines: Cuisine[],
  price: number,
  rating: number,
  verified: boolean
) {
  return useInfiniteQuery({
    queryKey: ['restaurants', cuisines, price, rating, verified],
    queryFn: async ({ pageParam = 1 }) => {
      const restaurants = await fetchNextPage(
        pageParam,
        cuisines,
        price,
        rating,
        verified
      );
      return { restaurants };
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.restaurants.length > 0 ? pages.length + 1 : undefined;
    },
    initialData: {
      pages: [{ restaurants: initialData }],
      pageParams: [1],
    },
    staleTime: 1000 * 60 * 10,
    initialPageParam: 1,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}