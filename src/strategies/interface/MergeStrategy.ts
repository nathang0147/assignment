import {Hotel} from "../../models/Hotel";
import {StandardizedHotelData} from "../../models/Hotel";

export interface MergeStrategy{
  merge(hotels: StandardizedHotelData[]): any;
}