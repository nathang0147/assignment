import { Hotel, StandardizedHotelData } from "../models/Hotel";
import { MergeStrategy } from "./interface/MergeStrategy";

export class LocationMergeStrategy implements MergeStrategy {
  merge(hotels: StandardizedHotelData[]) {
    const addresses = hotels.map(h => h.address).filter(Boolean);
    const postalCodes = hotels.map(h => h.postalCode).filter(Boolean);
    const mostCompleteAddress = addresses.sort((a, b) => b.length - a.length)[0] || '';

    return `${mostCompleteAddress}${postalCodes.length ? ', ' + postalCodes[0] : ''}`;
  }
}