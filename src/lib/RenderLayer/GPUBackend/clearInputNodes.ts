import type { DirtyResourceMap, PhysicalResourceMap } from "../RenderHelpers/types";

function clearInputNodes(
    assets: RenderGraphAssets,
    graphId: string,
    targetTexture: string,
    physicalResourceMap: PhysicalResourceMap,
    dirtyResources: DirtyResourceMap,
    gpuBackend: any,
): DirtyResourceMap {
    const drm = {};
    return drm;
}

export default clearInputNodes;