export interface Hotel {
  id: string;
  destination_id: number;
  name: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    country: string;
  };
  description: string;
  amenities: {
    general: string[];
    room : string[];
  };
  images:{
    rooms: { link: string, description: string}[];
    site: { link: string, description: string;}[];
    amenities: { link: string, description: string;}[];
  }
  booking_conditions: string[]
}

export interface StandardizedHotelData {
  id: string;
  destinationId: number;
  name: string;
  lat: number;
  lng: number;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
  description: string;
  generalAmenities: string[];
  roomAmenities: string[];
  roomImages: { link: string; description: string }[];
  amenitiesImages: { link: string; description: string }[];
  siteImages: { link: string; description: string }[];
  booking_conditions: string[];
}

export interface RawHotelData {
  [key: string]: any;
}
