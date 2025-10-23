
import type { PhysicalResourceMap, DirtyResourceMap } from "../RenderHelpers/types";


function performRenderPasses(
    assets: RenderGraphAssets,
    graphId: string,
    targetTexture: string,
    physicalResourceMap: PhysicalResourceMap,
    dirtyResources: DirtyResourceMap,
    gpuBackend: any,
) : [DirtyResourceMap, PhysicalResourceMap] {
    const drm = { ...dirtyResources };
    const prm = { ...physicalResourceMap };
    return [drm, prm];
}

export default performRenderPasses;