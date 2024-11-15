import { Hotel, StandardizedHotelData } from '../models/Hotel';

type NormalizationStrategy = (value: any) => any;

const normalizationStrategies: { [key: string]: NormalizationStrategy } = {
  // Image-specific normalization
  images: (value: string[] | null) => (Array.isArray(value) ? value.map((description: string) => cleanString(description)) : []),

  // Address normalization
  address: (value: string | null) => value ? formatAddress(value) : '',

  // Country/City specific case normalization
  country: (value: string | null) => value ? specificName(value) : '',
  city: (value: string | null) => value ? specificName(value) : '',

  // General amenities and room amenities
  amenities: (value: string[] | null) => (Array.isArray(value) ? value.map((item: string) => cleanString(item.toLowerCase())) : []),

  // Booking conditions, taking every third item
  booking_conditions: (value: string[] | null) => (Array.isArray(value) ? cleanArrayString(value.filter((_, i) => i % 3 === 0)) : []),

  // Default string normalization
  defaultString: (value: string) => cleanString(normalizeCase(value)),

  // Default array normalization
  defaultArray: (value: string[] | null) => (Array.isArray(value) ? cleanArrayString(value) : []),
};

export function normalizeData(hotels: StandardizedHotelData[]): StandardizedHotelData[] {
  return hotels.map(hotel => {
    const normalizedHotel: Partial<StandardizedHotelData> = {};

    // Step 1: Exclude empty values consistently
    for (const [key, value] of Object.entries(hotel)) {
      normalizedHotel[key as keyof StandardizedHotelData] = (value !== null && value !== '' && !(Array.isArray(value) && value.length === 0)) ? value : null;
    }

    // Step 2: Apply selective normalization based on data type or field requirements
    for (const [key, value] of Object.entries(normalizedHotel)) {
      if (key.includes("Images") && Array.isArray(value)) {
        normalizedHotel[key as keyof StandardizedHotelData] = normalizationStrategies.images(value);
      } else if (normalizationStrategies[key]) {
        // Use specific strategy if available
        normalizedHotel[key as keyof StandardizedHotelData] = normalizationStrategies[key](value);
      } else if (typeof value === "string") {
        // Use default string normalization
        normalizedHotel[key as keyof StandardizedHotelData] = normalizationStrategies.defaultString(value);
      } else if (Array.isArray(value)) {
        // Use default array normalization
        normalizedHotel[key as keyof StandardizedHotelData] = normalizationStrategies.defaultArray(value);
      }
    }

    return normalizedHotel as StandardizedHotelData;
  });
}

// Helper Functions

function cleanString(value: string): string {
  return value.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
}

function cleanArrayString(arr: string[]): string[] {
  return arr.map(item => typeof item === "string" ? cleanString(item) : item);
}

function specificName(value: string): string {
  return value.toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function normalizeCase(value: string): string {
  return value.toLowerCase();
}

function formatAddress(rawAddress: string, name?: string, city?: string, postalCode?: string): string {
  const addressParts = rawAddress.split(',').map(part => part.trim());
  let street = '';
  let place = '';
  let postal = '';

  addressParts.forEach(part => {
    if (/\d/.test(part) && /[a-zA-Z]/.test(part)) {
      street = cleanString(part);
    } else if (/^[0-9\s-]+$/.test(part)) {
      postal = part;
    } else if (/[a-zA-Z]/.test(part)) {
      place = cleanString(part);
    }
  });

  street = specificName(street);
  postal = postal || cleanString(postalCode || '');

  if (!place && name && city) {
    const nameParts = name.split(' ');
    const cityParts = city.split(' ');
    place = nameParts.filter(word => !cityParts.includes(word)).join(' ');
  }

  return [street, place, postal].filter(part => part).join(', ');
}
