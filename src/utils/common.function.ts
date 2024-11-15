import {StandardizedHotelData} from "../models/Hotel";

export function parseArgument(arg: string): string[] | null {
    return arg.toLowerCase() === 'none' ? null : arg.split(' ').map(item => item.trim());
}

export function filterHotels(
    hotels: StandardizedHotelData[],
    hotelIds: string[] | null,
    destinationIds: string[] | null
): StandardizedHotelData[] {
    return hotels.filter(hotel => {
        const matchesHotelId = !hotelIds || hotelIds.includes(hotel.id);
        const matchesDestinationId = !destinationIds || destinationIds.includes(hotel.destinationId.toString());
        return matchesHotelId && matchesDestinationId;
    });
}