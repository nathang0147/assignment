import {Command} from "commander";
import {HotelDataService} from "./services/HotelService";
import {parseArgument} from "./utils/common.function";

const program = new Command()

program
  .argument('<hotel_ids>', 'Comma-separated list of hotel IDs')
  .argument('<destination_ids>', 'Comma-separated list of destination IDs')
  .action(async (hotelIdsArg: string, destinationIdsArg: string) => {
    const hotelDataService = new HotelDataService();
    console.log("hotelIdsArg", hotelIdsArg);
    console.log("destinationIdsArg", destinationIdsArg);

    // Parse the comma-separated arguments into arrays
      const hotelIdsArray = parseArgument(hotelIdsArg);
      const destinationIdsArray = parseArgument(destinationIdsArg);

      console.log(hotelIdsArray, destinationIdsArray);

    const result = await hotelDataService.getMergeHotels(hotelIdsArray, destinationIdsArray);
    console.log(JSON.stringify(result, null, 2));
  });

program.parse();