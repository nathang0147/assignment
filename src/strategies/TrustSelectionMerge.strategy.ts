import {MergeStrategy} from "./interface/MergeStrategy";

export class TrustSelectionMergeStrategy implements MergeStrategy {
    constructor(private fallback: MergeStrategy) {}

    merge(existing: { description: string; trust: number }, incoming: { description: string; trust: number }): string {
        // based on trust level, turn to longest string if trust equal or description empty
        if (incoming.trust > existing.trust) {
            return incoming.description || this.fallback.merge(existing.description, incoming.description);
        } else if (incoming.trust < existing.trust) {
            return existing.description || this.fallback.merge(existing.description, incoming.description);
        } else {
            // Fallback to longest string strategy if trust levels are the same
            return this.fallback.merge(existing.description, incoming.description);
        }
    }
}