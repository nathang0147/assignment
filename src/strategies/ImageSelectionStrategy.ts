import { Hotel, StandardizedHotelData } from "../models/Hotel";
import { MergeStrategy } from "./interface/MergeStrategy";

export class ImageSelectionStrategy implements MergeStrategy {
  merge(hotels: StandardizedHotelData[]) {
    const images = {
      roomImages: this.getUniqueImages(hotels, 'roomImages'),
      siteImages: this.getUniqueImages(hotels, 'siteImages'),
      amenitiesImages: this.getUniqueImages(hotels, 'amenitiesImages'),
    };
    return images;
  }

  private getUniqueImages(
    hotels: StandardizedHotelData[],
    field: keyof Pick<StandardizedHotelData, 'roomImages' | 'siteImages' | 'amenitiesImages'>
  ): { link: string; description: string }[] {
    // Flatten and collect all images for the specified field, filtering for unique URLs
    const images = hotels.flatMap(h => h[field] || []);
    const uniqueImages = new Map(images.map(img => [img.link, img]));
    return Array.from(uniqueImages.values());
  }
}