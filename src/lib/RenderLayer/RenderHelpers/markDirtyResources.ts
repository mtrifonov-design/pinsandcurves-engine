import type { InputTexture, Instances, Texture, Uniforms, Vertices, VirtualResourceGraph } from "../../Types/VirtualResources";
import type { DirtyResourceMap } from "./types";
import getDependents from "./getDependents";
import derivePhysicalResourceId from "./derivePhysicalResourceId";

function recursivelyPropagateDirtiness(resourceId: string, graph: VirtualResourceGraph, dirtyResources: DirtyResourceMap) {
    function markDependentsDirtyRecursively(resId: string) {
        const dependents = getDependents(resId, graph);
        for (const dep of dependents) {
            if (!dirtyResources[dep]) {
                dirtyResources[dep] = true;
                markDependentsDirtyRecursively(dep);
            }
        }
    }
    markDependentsDirtyRecursively(resourceId);
}

function markDirtyResources(oldGraph : VirtualResourceGraph, newGraph : VirtualResourceGraph, oldDirtyResources : DirtyResourceMap) : DirtyResourceMap {
    const dirtyResources : DirtyResourceMap = {};

    for (let resourceId of Object.keys(newGraph)) {
        const derivedResourceId = derivePhysicalResourceId(resourceId, newGraph[resourceId].signature);
        if (oldDirtyResources[derivedResourceId]) {
            dirtyResources[derivedResourceId] = true;
            continue;
        }

        let isDirty = false;
        const oldResource = oldGraph[resourceId];
        if (!oldResource) {
            dirtyResources[derivedResourceId] = true;
            continue;
        }
        const newResource = newGraph[resourceId];
        if (JSON.stringify(oldResource) !== JSON.stringify(newResource)) {
            isDirty = true;
        }
        if (isDirty) {
            dirtyResources[resourceId] = true;
        }
        // Finally, propagate dirtiness from dependencies
        recursivelyPropagateDirtiness(resourceId, newGraph, dirtyResources);
    }

    return dirtyResources;
}

export default markDirtyResources;