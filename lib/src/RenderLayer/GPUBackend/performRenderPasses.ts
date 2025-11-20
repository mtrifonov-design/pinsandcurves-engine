
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

    // escape: if the target texture is not dirty, and resident, we can skip all render passes
    const targetPhysicalId = derivePhysicalResourceId(targetTexture, assets[graphId][targetTexture].signature);
    const targetResident = physicalResourceMap.namedResources[targetPhysicalId] !== undefined;
    const targetDirty = dirtyResources[targetPhysicalId] !== undefined;
    if (targetResident && !targetDirty) {
        console.log("Skipping render passes, target texture is resident and not dirty");
        return [dirtyResources, physicalResourceMap];
    }

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
        const signature = assets[graphId][resId].signature;
        const physicalId = derivePhysicalResourceId(resId, signature);
        const resident = prm.namedResources[physicalId] !== undefined;
        const dirty = drm[physicalId] !== undefined;
        return dirty || !resident;
    }))
    .map(resId => [resId, assets[graphId][resId]]);

    const textureLifetimeMap = computeTextureLifetimes(renderPassSeq);
    //console.log("Texture lifetimes:", textureLifetimeMap);

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
        const physicalResourceId = derivePhysicalResourceId(resId, res.signature);
        if (drm[physicalResourceId]) delete drm[physicalResourceId];
    }
    return [drm, prm];
}

export default performRenderPasses;