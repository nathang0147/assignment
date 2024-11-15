import { Hotel, StandardizedHotelData } from "../models/Hotel";
import { SupplierService } from "./SupplierService";
import {normalizeData} from "../sanitization/normalizer"
import {mergeService} from "./MergeService";
import {filterHotels} from "../utils/common.function";


export class HotelDataService {
  private supplierService: SupplierService;


  constructor() {
    this.supplierService = new SupplierService();
  }
  
  async getMergeHotels(hotelIds: string[] | null, destinationIds: string[] | null): Promise<any[]> {
    const rawData = await this.supplierService.fetchAndStandardize();
    let filteredData: StandardizedHotelData[];
    if(!hotelIds && !destinationIds) {
      filteredData = rawData;
    }else {
      filteredData = filterHotels(rawData, hotelIds, destinationIds);
    }

    const normalizedData = normalizeData(filteredData);

    const mergedHotels = mergeService.mergeData(normalizedData);

    return mergedHotels.map((mergedHotel) =>this.formatResultJson(mergedHotel));
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