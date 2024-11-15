## Project Structure
```
├── src
│   ├── config                // Configuration files
│   │   ├── mapping.config.ts //use for find path in standirdization step
│   │   └── apiSupplier.ts   // Supplier API endpoints configuration
│   ├── models                // Data models (TypeScript interfaces)
│   │   ├── Hotel.ts
│   │   └── SupplierData.ts
│   ├── services              // Core services for data fetching, parsing, and cleaning
│   │   ├── SupplierService.ts
│   │   ├── MergeService.ts
│   │   └── HotelDataService.ts
│   ├── strategies            // Different merge strategies
│   ├── sanitization          // Formatter and runner functions (e.g., data cleaning)
│   ├── utils                 // Common functions
│   └── index.ts              // CLI handling with Commander.js
├── runner.sh                 // Bash script for running CLI app
└── package.json              // Dependencies and scripts
```
## Usage
1. Install dependencies:

```bash
npm install
```
2. Run the CLI app: You can run the CLI application with the following command:

```bash
tsx src/index.ts $HOTEL_IDS $DESTINATION_IDS
```
Where `$HOTEL_IDS` and `$DESTINATION_IDS` are comma-separated lists of hotel and destination IDs. For example:

```bash
tsx src/index.ts hotel_id_1,hotel_id_2,hotel_id_3 destination_id_1,destination_id_2
```
3. Run using the bash script: Alternatively, you can use the runner.sh script to run the CLI app:

```bash
./runner.sh hotel_id_1,hotel_id_2 destination_id_1
```
This will pass the hotel_ids and destination_ids to the CLI app and execute it.

## Merge Strategies
The following merge strategies are applied to different fields during the merging process:

- LongestStringStrategy: Chooses the longest string value.
- UniqueArrayStrategy: Ensures the array contains unique values.
- ObjectArrayStrategy: Chooses the object with the longest description (used for images).
- LongestStringInArrayStrategy: Chooses the longest string in an array.
## Fields Merged:
- `name, lat, lng, address, city, country, postalCode, description`: Merged using the LongestStringStrategy.
- `roomAmenities, generalAmenities`: Merged using the UniqueArrayStrategy.
- `roomImages, siteImages, amenitiesImages`: Merged using the ObjectArrayStrategy.
- `booking_conditions`: Merged using the LongestStringInArrayStrategy.
