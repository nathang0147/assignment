import {Command} from "commander";
import {HotelDataService} from "./services/HotelService";

const program = new Command()

program
  .argument('<hotel_ids>', 'Comma-separated list of hotel IDs')
  .argument('<destination_ids>', 'Comma-separated list of destination IDs')
  .action(async (hotelIds: string, destinationIds: string) => {
    const hotelDataService = new HotelDataService();

    // Parse the comma-separated arguments into arrays
    const hotelIdsArray = hotelIds !== 'none' ? hotelIds.split(',').map(a => a.trim()) : null;
    const destinationIdsArray =destinationIds!== 'none' ? destinationIds.split(',').map(a=> a.trim()):null;

    const result = await hotelDataService.getMergeHotels(hotelIdsArray, destinationIdsArray);
    // console.log(JSON.stringify(result, null, 2));
  });

program.parse();