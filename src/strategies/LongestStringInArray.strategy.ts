import { MergeStrategy } from "./interface/MergeStrategy";

export class LongestStringInArrayStrategy implements MergeStrategy{
  merge(existing: string[], incoming: string[]) {
    if (!incoming || incoming.length === 0) return existing;
    if (!existing || existing.length === 0) return incoming;

    const maxLength = Math.max(existing.length, incoming.length);
    const result: string[] = [];

    for (let i = 0; i < maxLength; i++) {
      const existingItem = existing[i] || '';
      const incomingItem = incoming[i] || '';
      result.push(incomingItem.length > existingItem.length ? incomingItem : existingItem);
    }

    return result;
  }
}