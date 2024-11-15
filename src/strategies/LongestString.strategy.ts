import {MergeStrategy} from "./interface/MergeStrategy";

export class LongestStringStrategy implements MergeStrategy{
  merge(existing: any, incoming: any) {
    if (!incoming) return existing;
    if (!existing) return incoming;
    return incoming.length > existing.length ? incoming : existing;
  }
}