import axios from "axios";
import { SupplierData } from "../models/SupplierData";
import { apiEndpoints } from '../config/apiSuppliers';
import { standardizeData } from '../sanitization/standardizer';
import { RawHotelData,StandardizedHotelData } from '../models/Hotel';

export class SupplierService {
  async fetchAndStandardize(): Promise<StandardizedHotelData[]> {
    const suppliers = ['acme', 'patagonia', 'paperflies']

    const responses: RawHotelData[] = []
    // Fetch data from all suppliers in parallel
    await Promise.all(
      suppliers.map(supplier => 
        axios.get(String(apiEndpoints[supplier]))
          .then(data => {
            return data.data.map(d => {
                if(supplier === 'acme') {
                    responses.push({...d, trust: 0})
                }else if(supplier === 'patagonia') {
                    responses.push({...d, trust: 1})
                }else if(supplier === 'paperflies') {
                    responses.push({...d, trust: 2})
                }
            }) //removed nest array;
          })
      )
    );

    // Standardize data to ensure uniform structure
    return standardizeData(responses); 
  }
}