import type { PhysicalResourceMap, RequiredPhysicalResourcesMap } from "../RenderHelpers/types";

function synchronizePhysicalResources(
    currentPhysicalResourceMap: PhysicalResourceMap,
    requiredPhysicalResourceMap: RequiredPhysicalResourcesMap,
    gpuBackend: any,
) : PhysicalResourceMap {
    const newPhysicalResourceMap: PhysicalResourceMap = {
        namedResources: {},
        freeResources: {}
    };
    return newPhysicalResourceMap;
}

export default synchronizePhysicalResources;