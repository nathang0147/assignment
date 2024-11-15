import { Hotel, StandardizedHotelData } from "../models/Hotel";
import { MergeStrategy } from "./interface/MergeStrategy";

export class AmenitiesMergeStrategy implements MergeStrategy{
  merge(hotels: StandardizedHotelData[]){
    const amenities :{ general: string[], room: string[] } = { general: [], room: [] }
    hotels.forEach(hotel => {
      amenities.general = [...new Set([...amenities.general, ...hotel.generalAmenities])];
      amenities.room = [...new Set([...amenities.room, ...hotel.roomAmenities])]
    });
    return amenities             
  }
}