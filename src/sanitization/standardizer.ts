import { keyMapping } from '../config/mapping.config';
import { RawHotelData,StandardizedHotelData } from '../models/Hotel';

// Main function for standardizing data
export function standardizeData(rawData: RawHotelData[]): StandardizedHotelData[] {

    return rawData.map( (data) => {
    const standardizedData: Partial<StandardizedHotelData> = {};
    const { generalAmenities, roomAmenities } = standardizeAmenities(data);
    const {roomImages, amenitiesImages, siteImages} = standardizeImages(data);

    // Direct mapping with fallback to custom functions
    standardizedData.id = mapField(data, keyMapping.id) as string;
    standardizedData.destinationId = mapField(data, keyMapping.destinationId) as number;
    standardizedData.name = mapField(data, keyMapping.name) as string;
    standardizedData.lat = mapField(data, keyMapping.lat) as number;
    standardizedData.lng = mapField(data, keyMapping.lng) as number;
    standardizedData.trust =  data.trust

    // Address and postal code are handled separately
    standardizedData.address = standardizeAddress(data);
    standardizedData.postalCode = mapField(data, keyMapping.postalCode) as string ||    extractPostalCode(standardizeAddress(data));

    // Other fields using custom standardizing functions
    standardizedData.city = mapField(data, keyMapping.city) as string;
    standardizedData.country = mapField(data, keyMapping.country) as string;
    standardizedData.description = mapField(data, keyMapping.description) as string;
    standardizedData.generalAmenities = generalAmenities;
    standardizedData.roomAmenities = roomAmenities;
    standardizedData.roomImages = roomImages;
    standardizedData.amenitiesImages = amenitiesImages;
    standardizedData.siteImages = siteImages;
    standardizedData.booking_conditions = mapField(data, keyMapping.booking_conditions) as string[];

    return standardizedData as StandardizedHotelData;
  });
}

// Helper function to map fields based on possible keys
function mapField(data: RawHotelData, possibleKeys: string[]) {
  for (const key of possibleKeys) {
    const value = getNestedValue(data, key);
    if (value !== undefined) {
      return Array.isArray(value) ? value.map((v: any) => v.toString().trim()) : value;
    }
  }
  return null;
}

// Function to get a nested value based on dot notation
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
}

// Standardize address (handles multiple formats)
function standardizeAddress(data: RawHotelData): string {
  return mapField(data, keyMapping.address) as string || '';
}

// Standardize amenities, handling nested arrays and different structures
function standardizeAmenities(data: RawHotelData) {
  const roomAmenitiesPaths = keyMapping.roomAmenities;
  const generalAmenitiesPaths = keyMapping.generalAmenities;
  const roomAmenities: string[] = [];
  const generalAmenities: string[] = [];

  for (const path of roomAmenitiesPaths) {
    const amenityArray = getNestedValue(data, path) || [];
    if (Array.isArray(amenityArray)) {
      roomAmenities.push(...amenityArray);
    }
  }

  for (const path of generalAmenitiesPaths){
    const amenityArray = getNestedValue(data, path) || [];
    if (Array.isArray(amenityArray)){
      generalAmenities.push(...amenityArray);
    }
  }
  

  return {generalAmenities, roomAmenities}
}

// Standardize images with structured output
function standardizeImages(data: RawHotelData) {
  const roomImages: { link: string; description: string }[] = [];
  const amenitiesImages: { link: string; description: string }[] = [];
  const siteImages: { link: string; description: string }[] = [];

  if (data.images?.rooms) {
    roomImages.push(...data.images.rooms.map((img: any) => ({
      link: img.url || img.link,
      description: img.description || img.caption || 'Room Image'
    })));
  }

  if (data.images?.amenities) {
    amenitiesImages.push(...data.images.amenities.map((img: any) => ({
      link: img.url || img.link,
      description: img.description || img.caption || 'Amenity Image'
    })));
  }

  if (data.images?.site) {
    siteImages.push(...data.images.site.map((img: any) => ({
      link: img.url || img.link,
      description: img.caption || 'Site Image'
    })));
  }

  return {roomImages, amenitiesImages, siteImages};
}

// Extract postal code from address if it exists
function extractPostalCode(address: string): string {
  const postalCodeMatch = address.match(/\b\d{5,6}\b/);
  return postalCodeMatch ? postalCodeMatch[0] : '';
}
