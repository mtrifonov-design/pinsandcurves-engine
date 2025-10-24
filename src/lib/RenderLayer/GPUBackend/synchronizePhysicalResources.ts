import type { PhysicalResourceMap, RequiredPhysicalResourcesMap } from "../RenderHelpers/types";
import type GPUBackend from "./gpuBackend";

function synchronizePhysicalResources(
    currentPhysicalResourceMap: PhysicalResourceMap,
    requiredPhysicalResourceMap: RequiredPhysicalResourcesMap,
    gpuBackend: GPUBackend,
) : PhysicalResourceMap {
    const newPhysicalResourceMap: PhysicalResourceMap = {
        namedResources: { ...currentPhysicalResourceMap.namedResources },
        freeResources: { ...currentPhysicalResourceMap.freeResources }
    };

    // we want to compare physical resource map with required physical resource map
    // and allocate new resources as needed, and free resources that are no longer needed

    // allocate new named resources
    for (const resourceName in requiredPhysicalResourceMap.namedResources) {
        if (!(resourceName in newPhysicalResourceMap.namedResources)) {
            // needs allocation
            const requiredResource = requiredPhysicalResourceMap.namedResources[resourceName];
            const newResource = gpuBackend.createResource(requiredResource);
            newPhysicalResourceMap.namedResources[resourceName] = {
                persistent: true, // named resources from the required map are always persistent
                gpuResource: newResource,
                signature: requiredResource,
            };
        }
    }

    // release named resources that are no longer needed
    for (const resourceName in newPhysicalResourceMap.namedResources) {
        // consider only persistent resources
        if (newPhysicalResourceMap.namedResources[resourceName].persistent) {
            if (!(resourceName in requiredPhysicalResourceMap.namedResources)) {
                gpuBackend.releaseResource(newPhysicalResourceMap.namedResources[resourceName].gpuResource);
                delete newPhysicalResourceMap.namedResources[resourceName];
            }
        }
    }

    // synchronize free resources declared in requiredPhysicalResourceMap
    for (const resourceId in requiredPhysicalResourceMap.freeResources) {
        const signature = requiredPhysicalResourceMap.freeResources[resourceId][0];
        const requiredCount = requiredPhysicalResourceMap.freeResources[resourceId][1];
        // make sure that an entry exists
        if (!(resourceId in newPhysicalResourceMap.freeResources)) {
            newPhysicalResourceMap.freeResources[resourceId] = {
                signature: signature,
                gpuResources: [],
            };
        }
        let existingCount = newPhysicalResourceMap.freeResources[resourceId].gpuResources.length;
        // existingCount is misleading, because some free resources may be bound and show up as named resources
        const boundResources = Object.values(newPhysicalResourceMap.namedResources)
            .filter(res => {
                // non-persistent named resources that match the signature
                return !res.persistent && JSON.stringify(res.signature) === JSON.stringify(signature);
            })
            .map(res => res.gpuResource);
        existingCount += boundResources.length;

        while (existingCount !== requiredCount) {
            if (existingCount < requiredCount) {
                // allocate new free resource
                const newResource = gpuBackend.createResource(signature);
                newPhysicalResourceMap.freeResources[resourceId].gpuResources.push(newResource);
                existingCount++;
            }
            else {
                // start by releasing from the pool if possible
                if (newPhysicalResourceMap.freeResources[resourceId].gpuResources.length > 0) {
                    const resourceToRelease = newPhysicalResourceMap.freeResources[resourceId].gpuResources.pop() as string;
                    gpuBackend.releaseResource(resourceToRelease);
                    existingCount--;
                } else {
                    // otherwise we need to find a bound resource to release
                    const resourceToRelease = boundResources.pop() as string;
                    gpuBackend.releaseResource(resourceToRelease);
                    existingCount--;
                }
            }
        }

        // release any free resource that no longer show up in requiredPhysicalResourceMap
        for (const resourceId in newPhysicalResourceMap.freeResources) {
            if (!(resourceId in requiredPhysicalResourceMap.freeResources)) {
                // release all resources in the pool
                for (const gpuResource of newPhysicalResourceMap.freeResources[resourceId].gpuResources) {
                    gpuBackend.releaseResource(gpuResource);
                }
                // release any bound resources as well
                const boundResources = Object.values(newPhysicalResourceMap.namedResources)
                    .filter(res => {
                        // non-persistent named resources that match the signature
                        return !res.persistent && JSON.stringify(res.signature) === JSON.stringify(newPhysicalResourceMap.freeResources[resourceId].signature);
                    })
                    .map(res => res.gpuResource);
                for (const gpuResource of boundResources) {
                    gpuBackend.releaseResource(gpuResource);
                }
                // delete the entry
                delete newPhysicalResourceMap.freeResources[resourceId];
            }
        }
    }

    return newPhysicalResourceMap;
}

export default synchronizePhysicalResources;