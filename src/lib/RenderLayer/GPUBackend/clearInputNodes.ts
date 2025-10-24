import type { VirtualResourceGraph } from "../../Types/VirtualResources";
import topoSortResources from "../RenderHelpers/topoSortResources";
import type { DirtyResourceMap, PhysicalResourceMap, RenderGraphAssets } from "../RenderHelpers/types";
import type GPUBackend from "./gpuBackend";
import derivePhysicalResourceId from "../RenderHelpers/derivePhysicalResourceId";
import uploadResourceData from "./uploadResourceData";

function clearInputNodes(
    assets: RenderGraphAssets,
    graphId: string,
    targetTexture: string,
    physicalResourceMap: PhysicalResourceMap,
    dirtyResources: DirtyResourceMap,
    gpuBackend: GPUBackend,
): DirtyResourceMap {
    const drm = { ...dirtyResources };
    const graph : VirtualResourceGraph = assets[graphId];
    const inputNodeTypes = ["input-texture","vertices","instances","uniforms"];
    const dirtyInputResources: string[] = topoSortResources(graph, targetTexture)
    .filter(resId => inputNodeTypes.includes(graph[resId].signature.type))
    .map(resId => {
        const signature = graph[resId].signature;
        const physicalResourceId = derivePhysicalResourceId(resId, signature);
        return [resId,physicalResourceId];
    })
    .filter(([resId,pResId]) => Object.keys(drm).includes(pResId));

    for (const [resId,pResId] of dirtyInputResources) {
        delete drm[pResId];
    }
    // now we need to upload new data to GPU for each dirty input resource
    for (const [resId,pResId] of dirtyInputResources) {
        const resource = graph[resId];
        const signature = resource.signature;
        const physicalResourceId = derivePhysicalResourceId(resId, signature);
        const physicalResource = physicalResourceMap.namedResources[physicalResourceId];
        uploadResourceData(resId, resource, assets[graphId], assets, gpuBackend,
            physicalResourceMap
        );
    }
    return drm;
}

export default clearInputNodes;