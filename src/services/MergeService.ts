import {MergeStrategy} from "../strategies/interface/MergeStrategy";
import {ObjectArrayStrategy} from "../strategies/ObjectArray.strategy";
import {UniqueArrayStrategy} from "../strategies/UniqueArray.strategy";
import {LongestStringInArrayStrategy} from "../strategies/LongestStringInArray.strategy";
import {StandardizedHotelData} from "../models/Hotel";
import {LongestStringStrategy} from "../strategies/LongestString.strategy";

class MergeService {
    private static instance: MergeService;

    private strategies: Record<string, MergeStrategy> = {
        name: new LongestStringStrategy(),
        lat: new LongestStringStrategy(),
        lng: new LongestStringStrategy(),
        address: new LongestStringStrategy(),
        city: new LongestStringStrategy(),
        country: new LongestStringStrategy(),
        postalCode: new LongestStringStrategy(),
        description: new LongestStringStrategy(),
        roomAmenities: new UniqueArrayStrategy(),
        generalAmenities: new UniqueArrayStrategy(),
        roomImages: new ObjectArrayStrategy(),
        siteImages: new ObjectArrayStrategy(),
        amenitiesImages: new ObjectArrayStrategy(),
        booking_conditions: new LongestStringInArrayStrategy(),
    };

    private constructor() {}

    public static getInstance(): MergeService {
        if (!MergeService.instance) {
            MergeService.instance = new MergeService();
        }
        return MergeService.instance;
    }

    public mergeData(hotels: StandardizedHotelData[]): StandardizedHotelData[] {
        const idMap: { [id: string]: StandardizedHotelData } = {};

        hotels.forEach(hotel => {
            const id = hotel.id;
            if (!idMap[id]) {
                idMap[id] = { ...hotel };
            } else {
                const existing = idMap[id];

                Object.keys(hotel).forEach(key => {
                    if (!existing[key as keyof StandardizedHotelData]) {
                        // Initialize missing property in existing object
                        existing[key] = hotel[key as keyof StandardizedHotelData];
                    } else {
                        const strategy = this.strategies[key];
                        if (strategy) {
                            // Apply the strategy's merge method
                            existing[key] = strategy.merge(
                                existing[key],
                                hotel[key]
                            );
                        }
                    }
                });
                // Ensure roomAmenities do not exist in generalAmenities
                existing.roomAmenities = existing.roomAmenities.filter(
                    (item: string) => !existing.generalAmenities.includes(item)
                );

                // Sort images by description's first letter and link order
                const sortImages = (images: { link: string; description: string }[]) => {
                    if (!Array.isArray(images)) return [];
                    return images.sort((a, b) => {
                        const numA = parseInt(a.link.match(/\/(\d+)_m\.jpg$/)?.[1] || '0', 10);
                        const numB = parseInt(b.link.match(/\/(\d+)_m\.jpg$/)?.[1] || '0', 10);
                        return numA - numB;
                    });
                };

                existing.roomImages = sortImages(existing.roomImages);
                existing.siteImages = sortImages(existing.siteImages);
                existing.amenitiesImages = sortImages(existing.amenitiesImages);
            }
        });

        return Object.values(idMap);
    }
}

export const mergeService = MergeService.getInstance();