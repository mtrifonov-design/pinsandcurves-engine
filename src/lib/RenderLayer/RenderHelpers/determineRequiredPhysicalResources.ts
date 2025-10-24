import type { InstanceSignature, UniformSignature, VertexSignature, VirtualResourceGraph } from "../../Types/VirtualResources";
import derivePhysicalResourceId from "./derivePhysicalResourceId";
import type { PhysicalSignature, RenderPassSequence, RequiredPhysicalResourcesMap, TextureLifetimesMap } from "./types";
import topoSortResources from "./topoSortResources";
import deriveSignatureId from "./deriveSignatureId";
import computeTextureLifetimes from "./computeTextureLifetimes";


function determineRequiredPhysicalResources(graph: VirtualResourceGraph, targetTexture: string) : RequiredPhysicalResourcesMap {
    const requiredPhysicalResourcesMap: RequiredPhysicalResourcesMap = {
        namedResources: {},
        freeResources: {}
    };

    // first of all, we do the easy part. we find all named resources
    for (const [resourceId, resource] of Object.entries(graph)) {
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
    // topologically sort the resource graph.
    const sortedResources: string[] = topoSortResources(graph, targetTexture);
    const renderPassSeq : RenderPassSequence = sortedResources
        .filter(resId => graph[resId].signature.type === "texture" || graph[resId].signature.type === "rotating-texture")
        .map(resId => [resId, graph[resId]]);

    // compute the unique programs that we will need to render the passes
    const uniquePrograms = new Set<string>();
    for (const pass of renderPassSeq) {
        for (const drawOp of pass[1].drawOps) {
            const programSignature : PhysicalSignature = {
                type: 'program',
                fragmentShader: drawOp.fragmentShaderData.data as string,
                vertexShader: drawOp.vertexShaderData.data as string,
                vertexSignature: graph[drawOp.vertices.resource as string].signature as VertexSignature,
                instanceSignature: drawOp.instances ? (graph[drawOp.instances.resource as string].signature as InstanceSignature) : undefined,
                uniformSignatures: Object.fromEntries(
                    Object.entries(drawOp.uniforms).map(([bindingName, slot]) => [
                        bindingName,
                        graph[slot.resource as string].signature as UniformSignature
                    ])
                ),
                textures: Object.fromEntries(
                    Object.entries(drawOp.textures).map(([textureSlot, textureInfo]) => [
                        textureSlot,
                        {
                            textureSignature: graph[textureInfo.texture.resource as string].signature,
                            sampler: textureInfo.sampler
                        }
                    ])
                )
                }
            const programId = derivePhysicalResourceId('program', programSignature);
            uniquePrograms.add(programId);
            requiredPhysicalResourcesMap.namedResources[programId] = programSignature;
        }
    }

    const textureLifetimes : TextureLifetimesMap = computeTextureLifetimes(renderPassSeq);
    const uniqueSignatures = new Set<string>();
    for (const resId of Object.keys(textureLifetimes)) {
        const signature = graph[resId].signature;
        const signatureId = deriveSignatureId(signature);
        uniqueSignatures.add(signatureId);
    }

    // iterate over unique signatures
    for (const signatureId of uniqueSignatures) {
        // filter textureLifetimes to find all textures with this signature
        const texturesWithSignature = Object.entries(textureLifetimes).filter(([resId, _]) => {
            const signature = graph[resId].signature;
            return deriveSignatureId(signature) === signatureId;
        });

        // determine max concurrent usage
        let maxConcurrentUsage = 0;
        for (let passIdx = 0; passIdx < renderPassSeq.length; passIdx++) {
            for (let drawOpIdx = 0; drawOpIdx < renderPassSeq[passIdx][1].drawOps.length; drawOpIdx++) {
                let concurrentUsage = 0;
                for (const [resId, lifetime] of texturesWithSignature) {
                    if (lifetime.firstUseRenderPassIdx <= passIdx && lifetime.lastUseRenderPassIdx >= passIdx
                        && lifetime.firstUseDrawOpIdx <= drawOpIdx && lifetime.lastUseDrawOpIdx >= drawOpIdx
                    ) {
                        concurrentUsage++;
                    }
                }
                if (concurrentUsage > maxConcurrentUsage) {
                    maxConcurrentUsage = concurrentUsage;
                }
            }
        }
        requiredPhysicalResourcesMap.freeResources[signatureId] = [graph[texturesWithSignature[0][0]].signature, maxConcurrentUsage+1];
    }
    return requiredPhysicalResourcesMap;
}

export default determineRequiredPhysicalResources;