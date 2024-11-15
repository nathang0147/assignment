import { MergeStrategy } from "../strategies/interface/MergeStrategy";
import { DescriptionMergeStrategy } from "../strategies/LongestDescriptionStrategy";
import { ImageSelectionStrategy } from "../strategies/ImageSelectionStrategy";
import { LocationMergeStrategy } from "../strategies/LocationMergeStrategy";
import { AmenitiesMergeStrategy } from "../strategies/AmenitiesMergeStrategy";
import {BookingConditionMergeStrategy} from "../strategies/BookingConditionMergeStrategy";
import { StandardizedHotelData } from "../models/Hotel";

  export class MergeService {
    private strategies: Record<string, MergeStrategy> = {
      description: new DescriptionMergeStrategy(),
      location: new LocationMergeStrategy(),
      amenities: new AmenitiesMergeStrategy(),
      images: new ImageSelectionStrategy(),
      bookingConditions: new BookingConditionMergeStrategy(),
    };

    merge(hotels: StandardizedHotelData[]): StandardizedHotelData { 
      return {
        id: hotels[0].id,
        destinationId: hotels[0].destinationId,
        name: hotels[0].name,
        lat: hotels[0].lat,
        lng: hotels[0].lng,
        address: this.strategies.location.merge(hotels),
        city: hotels[0].city,
        country: hotels[0].country,
        postalCode: hotels[0].postalCode,
        description: this.strategies.description.merge(hotels),
        generalAmenities: this.strategies.amenities.merge(hotels).general,
        roomAmenities: this.strategies.amenities.merge(hotels).room,
        roomImages: this.strategies.images.merge(hotels).roomImages,
        siteImages: this.strategies.images.merge(hotels).siteImages,
        amenitiesImages: this.strategies.images.merge(hotels).amenitiesImages,
        booking_conditions: this.strategies.bookingConditions.merge(hotels),
      };
    }
  }