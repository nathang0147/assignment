import { MergeStrategy } from "./interface/MergeStrategy";

export class ObjectArrayStrategy implements MergeStrategy {
  merge(existing: { link: string; description: string }[], incoming: { link: string; description: string }[]) {
    const existingArray = Array.isArray(existing) ? existing : [];
    const incomingArray = Array.isArray(incoming) ? incoming : [];
    const linkMap: { [link: string]: string } = {};

    // Merge and choose longest description for each unique link
    [...existingArray, ...incomingArray].forEach(item => {
      if (!linkMap[item.link] || item.description.length > linkMap[item.link].length) {
        linkMap[item.link] = item.description;
      }
    });

    // Convert the map back to array format
    return Object.entries(linkMap).map(([link, description]) => ({ link, description }));
  }
}