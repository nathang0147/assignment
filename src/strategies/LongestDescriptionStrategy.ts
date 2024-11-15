import {MergeStrategy} from './interface/MergeStrategy';
import {Hotel, StandardizedHotelData} from '../models/Hotel';

export class DescriptionMergeStrategy implements MergeStrategy {
  merge(hotels: StandardizedHotelData[]): string {
    const descriptions = hotels.map(h => h.description).filter(Boolean);
    const longest = descriptions.sort((a, b) => b.length - a.length)[0];
    return longest && !this.isGeneric(longest) ? longest : descriptions.find(desc => !this.isGeneric(desc)) || longest || '';
  }

  private isGeneric(description: string): boolean {
    const genericWords = ['hotel', 'stay', 'resort', 'lodging', 'accommodation', 'property', 'apartment'];
    return genericWords.some(word => description.toLowerCase().includes(word));
  }
}