
import computeTextureLifetimes from "../RenderHelpers/computeTextureLifetimes";
import topoSortResources from "../RenderHelpers/topoSortResources";
import type { PhysicalResourceMap, DirtyResourceMap, RenderPassSequence, RenderGraphAssets } from "../RenderHelpers/types";
import performRenderPass from "./performRenderPass";


function performRenderPasses(
    assets: RenderGraphAssets,
    graphId: string,
    targetTexture: string,
    physicalResourceMap: PhysicalResourceMap,
    dirtyResources: DirtyResourceMap,
    gpuBackend: any,
) : [DirtyResourceMap, PhysicalResourceMap] {
    const drm = { ...dirtyResources };
    const prm = { 
        namedResources: { ...physicalResourceMap.namedResources },
        freeResources: { ...physicalResourceMap.freeResources },
     };

    const sortedResources = topoSortResources(assets[graphId], targetTexture);
    const renderPassSeq : RenderPassSequence = sortedResources
    .filter(resId => ["rotating-texture","texture"].includes(assets[graphId][resId].signature.type))
    .filter((resId => drm[resId] !== undefined))
    .map(resId => [resId, assets[graphId][resId]]);

    const textureLifetimeMap = computeTextureLifetimes(renderPassSeq);

    for (const [resId, res] of renderPassSeq) {
        performRenderPass(
            resId,
            assets[graphId],
            prm,
            textureLifetimeMap,
            gpuBackend,
        );
        // after performing the render pass, we can clear the dirty flag for this resource
        delete drm[resId];
    }
    return [drm, prm];
}

export default performRenderPasses;