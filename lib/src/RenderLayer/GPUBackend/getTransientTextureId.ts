import type { TextureSignature } from "../../src/Types/VirtualResources";
import type { VirtualResourceGraph } from "../../Types/VirtualResources";
import derivePhysicalResourceId from "../RenderHelpers/derivePhysicalResourceId";
import deriveSignatureId from "../RenderHelpers/deriveSignatureId";
import type { PhysicalResourceMap, TextureLifetimesMap } from "../RenderHelpers/types";


function getVirtualIdFromPhysicalId(
    graph: VirtualResourceGraph,
    physicalId: string,
) {
    for (const [virtualId, resource] of Object.entries(graph)) {
        const signature = resource.signature as TextureSignature;
        const derivedPhysicalId = derivePhysicalResourceId(virtualId, signature);
        if (derivedPhysicalId === physicalId) {
            return virtualId;
        }
    }
    throw new Error(`Could not find virtual resource for physical id ${physicalId}`);
}

function getTransientTextureId(
    graph: VirtualResourceGraph,
    virtualId: string,
    signature: TextureSignature,
    prm: PhysicalResourceMap,
    tlm: TextureLifetimesMap,
    renderPassIdx: number,
    drawOpIdx: number,
) {
    const genericId = deriveSignatureId(signature);
    const specificId = derivePhysicalResourceId(virtualId, signature);
    const resource = prm.freeResources[genericId];
    if (prm.namedResources[specificId] !== undefined) {
        // the specific resource is already allocated, we can return it directly
        return prm.namedResources[specificId].gpuResource;
    } else if (resource.gpuResources.length > 0) {
        // we have a pooled resource available, so we can claim it
        const gpuResource = resource.gpuResources.pop()!;
        prm.namedResources[specificId] = {
            signature,
            persistent: false,
            gpuResource,
        };
        return gpuResource;
    } else {
        // if no pooled resource is available, we need to release a named transient texture whose lifetime has ended
        // we start by filtering for named resources that match our signature
        const candidateIds = Object.entries(prm.namedResources)
        .filter(([physId, res]) => {
            return JSON.stringify(res.signature) === JSON.stringify(signature);
        })
        .map(([physId, res]) => physId) // and we continue filtering for those whose lifetime has ended
        .filter(physId => {
            const virtId = getVirtualIdFromPhysicalId(graph, physId); 
            //console.log("Checking transient texture", virtId, physId, tlm);
            const lifetime = tlm[virtId];
            return lifetime.lastUseRenderPassIdx < renderPassIdx ||
                    lifetime.firstUseRenderPassIdx > renderPassIdx ||
                   (lifetime.lastUseRenderPassIdx === renderPassIdx && lifetime.lastUseDrawOpIdx < drawOpIdx);
        });
        if (candidateIds.length === 0) throw new Error("No available transient texture could be found for allocation. This should never happen.");
        // we pick the first candidate for release
        const toReleaseId = candidateIds[0];
        const toReleaseResource = prm.namedResources[toReleaseId].gpuResource;
        // we delete it from the named resources map
        delete prm.namedResources[toReleaseId];
        // now we claim it for our specific resource
        prm.namedResources[specificId] = {
            signature,
            persistent: false,
            gpuResource: toReleaseResource,
        };
        return toReleaseResource;
    }

}

export default getTransientTextureId;