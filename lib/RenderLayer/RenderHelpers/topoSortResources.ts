import type { VirtualResourceGraph } from "../../Types/VirtualResources";
import getDependencies from "./getDependencies";

function topoSortResources(graph: VirtualResourceGraph, targetResourceId: string): string[] {
    const visited: Set<string> = new Set();
    const tempMark: Set<string> = new Set();
    const sorted: string[] = [];
    function visit(resourceId: string) {
        if (visited.has(resourceId)) return;
        if (tempMark.has(resourceId)) {
            throw new Error("Graph has cycles, topological sort not possible");
        }
        tempMark.add(resourceId);
        const resource = graph[resourceId];
        if (resource) {
            const dependencies = getDependencies(resourceId, graph);
            for (const depId of dependencies) {
                visit(depId);
            }
        } else throw new Error(`Resource ${resourceId} not found in graph`);
        tempMark.delete(resourceId);
        visited.add(resourceId);
        sorted.push(resourceId);
    }
    visit(targetResourceId);
    return sorted;
}

export default topoSortResources;