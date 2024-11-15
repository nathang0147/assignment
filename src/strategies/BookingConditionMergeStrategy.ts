import { Hotel, StandardizedHotelData } from "../models/Hotel";
import { MergeStrategy } from "./interface/MergeStrategy";

export class BookingConditionMergeStrategy implements MergeStrategy{
  merge(hotels: StandardizedHotelData[]){
    const booking_condtions = hotels.find(h => h.booking_conditions)
    return booking_condtions
  }
}