import { Hotel, StandardizedHotelData } from "../models/Hotel";
import { SupplierService } from "./SupplierService";
import {normalizeData} from "../utils/normalizer"
import {MergeService} from './MergeService';

export class HotelDataService {
  private supplierService: SupplierService;
  private mergeService: MergeService;

  constructor() {
    this.supplierService = new SupplierService();
    this.mergeService = new MergeService();
  }
  
  async getMergeHotels(hotelIds: string[], destinationIds: string[]): Promise<any[]> {
    const rawData = await this.supplierService.fetchAndStandardize();
    
    const filteredData = rawData.filter((hotel) => hotelIds.some(a => a === hotel.id));

    console.log('Filtered Data:', filteredData); // Log the final filtered result


    const normalizedData = normalizeData(filteredData);
    // const mergedHotels = normalizedData.map((hotelData) => this.mergeService.merge([hotelData]));

    // return mergedHotels.map((mergedHotel) =>this.formatResultJson(mergedHotel));
    // console.log(normalizedData)
    return normalizedData
  }

  private formatResultJson(mergedData: StandardizedHotelData): Hotel {
    return {
      id: mergedData.id,
      destination_id: mergedData.destinationId,
      name: mergedData.name,
      location: {
        lat: mergedData.lat,
        lng: mergedData.lng,
        address: mergedData.address,
        city: mergedData.city,
        country: mergedData.country,
      },
      description: mergedData.description,
      amenities: {
        general: mergedData.generalAmenities,
        room: mergedData.roomAmenities
      },
      images: {
        rooms: mergedData.roomImages,
        site: mergedData.siteImages,
        amenities: mergedData.amenitiesImages
      },
      booking_conditions: mergedData.booking_conditions
    };
  }
}