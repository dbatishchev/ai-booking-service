import {
    createSearchParamsCache,
    parseAsBoolean,
    parseAsFloat,
    parseAsInteger,
    parseAsString,
    parseAsArrayOf,
  } from 'nuqs/server'
  // Note: import from 'nuqs/server' to avoid the "use client" directive
   
export const filtersParsers = {
    cuisines: parseAsArrayOf(parseAsString).withDefault([]),
    price: parseAsInteger.withDefault(0),
    rating: parseAsFloat.withDefault(0),
    verified: parseAsBoolean.withDefault(false),
}

export const searchParamsCache = createSearchParamsCache(filtersParsers)
