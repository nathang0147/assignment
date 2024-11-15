export const keyMapping: Record<string, string[]> = {
  id: ['Id', 'id', 'hotel_id'],
  destinationId: ['DestinationId', 'destination', 'destination_id'],
  name: ['Name', 'name', 'hotel_name'],
  lat: ['Latitude', 'lat', 'location.latitude'],
  lng: ['Longitude', 'lng', 'location.longitude'],
  address: ['Address', 'address', 'location.address'],
  city: ['City', 'location.city'],
  country: ['Country', 'country', 'location.country'],
  postalCode: ['PostalCode'],
  description: ['Description', 'info', 'details'],
  generalAmenities: ['Facilities', 'amenities.general',],
  roomAmenities: ['amenities', 'amenities.room'],
  roomsImages: ['Images.Rooms', 'images.rooms'],
  amenitiesImages: ['Images.Amenities', 'images.amenities'],
  siteImages: ['images.site'],
  booking_conditions: ['BookingConditions', 'booking_conditions']
};