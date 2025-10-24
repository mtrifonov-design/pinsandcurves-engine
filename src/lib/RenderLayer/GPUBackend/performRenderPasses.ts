
import computeTextureLifetimes from "../RenderHelpers/computeTextureLifetimes";
import derivePhysicalResourceId from "../RenderHelpers/derivePhysicalResourceId";
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
    .filter((resId => {
        // filter only resources that are either dirty or are not resident in the physical resource map
        const dirty = drm[resId] !== undefined;
        const signature = assets[graphId][resId].signature;
        const physicalId = derivePhysicalResourceId(resId, signature);
        const resident = prm.namedResources[physicalId] !== undefined;
        return dirty || !resident;
    }))
    .map(resId => [resId, assets[graphId][resId]]);

    const textureLifetimeMap = computeTextureLifetimes(renderPassSeq);

    let renderPassIdx = 0;
    for (const [resId, res] of renderPassSeq) {
        performRenderPass(
            resId,
            assets[graphId],
            prm,
            textureLifetimeMap,
            gpuBackend,
            renderPassIdx,
            assets,
        );
        renderPassIdx++;
        // after performing the render pass, we can clear the dirty flag for this resource
        if (drm[resId]) delete drm[resId];
    }
    return [drm, prm];
}

export default performRenderPasses;