import type { VirtualResourceGraph } from "../../Types/VirtualResources";
import derivePhysicalResourceId from "./derivePhysicalResourceId";
import type { RequiredPhysicalResourcesMap } from "./types";


function determineRequiredPhysicalResources(VirtualResourceGraph: VirtualResourceGraph) : RequiredPhysicalResourcesMap {
    const requiredPhysicalResourcesMap: RequiredPhysicalResourcesMap = {
        namedResources: {},
        freeResources: {}
    };

    // first of all, we do the easy part. we find all named resources
    for (const [resourceId, resource] of Object.entries(VirtualResourceGraph)) {
        const persistentTypes = ["input-texture", "vertices", "instances", "uniforms"];
        if (persistentTypes.includes(resource.signature.type)) {
            requiredPhysicalResourcesMap.namedResources[derivePhysicalResourceId(resourceId, resource.signature)] = resource.signature;
        }
        if (resource.signature.type === "rotating-texture") {
            for (let historyIdx = 0; historyIdx < (resource.signature.historyLength); historyIdx++) {
                requiredPhysicalResourcesMap.namedResources[derivePhysicalResourceId(resourceId, resource.signature, historyIdx)] = resource.signature;
            }
        }
    }

    // next comes the harder part, we need to ...

}