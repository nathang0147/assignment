import { MergeStrategy } from "./interface/MergeStrategy";

export class UniqueArrayStrategy implements MergeStrategy{
  merge(existing: any, incoming:any){
    const mergedSet = new Set(existing.concat(incoming));
    return Array.from(mergedSet);
  }
}