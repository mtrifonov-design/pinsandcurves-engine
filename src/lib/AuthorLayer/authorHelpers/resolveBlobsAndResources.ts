import PreResource from "../PreResourceBase";
import type { FlattenedPreResourceGraph } from "../types";
import type { BlobMap, DependencyArrays } from "./types";
import type { Instances, RotatingTexture, Texture, Uniforms, Vertices, VirtualResourceGraph } from "../../Types/VirtualResources";
/**
 * During the Author stage, PreResources represent data as Blob-generating functions that 
 * are invoked conditionally based on whether their dependencies have changed.
 * This module resolves these functions into either new Blob IDs (if dependencies changed),
 * accompanied with newly generated blobs, or retains existing Blob IDs (if dependencies are unchanged).
 */
function resolveBlobsAndResources(
    flattenedPrg: FlattenedPreResourceGraph,
    existingGraph: VirtualResourceGraph,
    existingDependencyArrays: DependencyArrays,
    existingBlobMap: BlobMap
) : [ 
    { [blobId: string]: ArrayBuffer }, 
    DependencyArrays,
    BlobMap
] {
    const blobs: { [blobId: string]: ArrayBuffer } = {};
    const newDependencyArrays: DependencyArrays = {};
    const newBlobMap: BlobMap = {};

    for (const [preResourceId, preResource] of Object.entries(flattenedPrg)) {
        let needsUpdate = false;
        if (existingGraph[preResourceId] && existingGraph[preResourceId].signature !== preResource.value.signature) {
            needsUpdate = true;
        }
        const existingDependencyArray = existingDependencyArrays[preResourceId];
        if (!existingDependencyArray) {
            needsUpdate = true;
        } else {
            const currentDependencyArray = preResource.dependencyArray;
            if (existingDependencyArray.length !== currentDependencyArray.length) {
                console.error("Dependency array length mismatch for preResourceId:", preResourceId);
                needsUpdate = true;
            } else {
                for (let i = 0; i < existingDependencyArray.length; i++) {
                    if (existingDependencyArray[i] !== currentDependencyArray[i]) {
                        needsUpdate = true;
                        break;
                    }
                }
            }
        }
        if (needsUpdate) {
            newDependencyArrays[preResourceId] = preResource.dependencyArray;
        } else {
            newDependencyArrays[preResourceId] = existingDependencyArray;
        }

        // this is handled case by case depending on preResource type
        const preResourceType = preResource.value.signature.type;
        if (preResourceType === "texture" || preResourceType === "rotating-texture") {
            const drawOps = (preResource.value as Texture | RotatingTexture).drawOps;
            for (let i = 0; i < drawOps.length; i++) {
                const vs_stableId = preResourceId + `/drawOp_${i}/vertices`;
                const fs_stableId = preResourceId + `/drawOp_${i}/fragments`;
                if (needsUpdate) {
                    const vertexShaderData = drawOps[i].vertexShaderData;
                    if (vertexShaderData.stage !== 'author') {
                        throw new Error("Expected author stage for vertex shader data");
                    }
                    const vsBlob = vertexShaderData.data();
                    const vsBlobId = crypto.randomUUID();
                    blobs[vsBlobId] = vsBlob;
                    newBlobMap[vs_stableId] = vsBlobId;
                    drawOps[i].vertexShaderData = {
                        stage: 'render',
                        data: vsBlobId
                    };

                    const fragmentShaderData = drawOps[i].fragmentShaderData;
                    if (fragmentShaderData.stage !== 'author') {
                        throw new Error("Expected author stage for fragment shader data");
                    }
                    const fsBlob = fragmentShaderData.data();
                    const fsBlobId = crypto.randomUUID();
                    blobs[fsBlobId] = fsBlob;
                    newBlobMap[fs_stableId] = fsBlobId;
                    drawOps[i].fragmentShaderData = {
                        stage: 'render',
                        data: fsBlobId
                    };
                } else {
                    newBlobMap[vs_stableId] = existingBlobMap[vs_stableId];
                    newBlobMap[fs_stableId] = existingBlobMap[fs_stableId];
                    drawOps[i].vertexShaderData = {
                        stage: "render",
                        data: existingBlobMap[vs_stableId]
                    };
                    drawOps[i].fragmentShaderData = {
                        stage: "render",
                        data: existingBlobMap[fs_stableId]
                    };
                }
            }
        }
        if (preResourceType === "vertices") {
            const vertices_stableId = preResourceId + `/vertices`;
            const indices_stableId = preResourceId + `/indices`;
            const vertices = preResource.value as Vertices;
            const indices = preResource.value as Vertices;
            if (needsUpdate) {

                const verticesData = vertices.verticesData;
                if (verticesData.stage !== 'author') {
                    throw new Error("Expected author stage for vertices data");
                }
                const verticesBlob = verticesData.data();
                const verticesBlobId = crypto.randomUUID();
                blobs[verticesBlobId] = verticesBlob;
                newBlobMap[vertices_stableId] = verticesBlobId;
                vertices.verticesData = {
                    stage: 'render',
                    data: verticesBlobId
                };



                const indicesData = indices.indicesData;
                if (indicesData.stage !== 'author') {
                    throw new Error("Expected author stage for indices data");
                }
                const indicesBlob = indicesData.data();
                const indicesBlobId = crypto.randomUUID();
                blobs[indicesBlobId] = indicesBlob;
                newBlobMap[indices_stableId] = indicesBlobId;
                indices.indicesData = {
                    stage: 'render',
                    data: indicesBlobId
                };
            } else {
                newBlobMap[vertices_stableId] = existingBlobMap[vertices_stableId];
                newBlobMap[indices_stableId] = existingBlobMap[indices_stableId];
                vertices.verticesData = {
                    stage: 'render',
                    data: existingBlobMap[vertices_stableId]
                };
                indices.indicesData = {
                    stage: 'render',
                    data: existingBlobMap[indices_stableId]
                };
            }
        }
        if (preResourceType === "instances") {
            const instances_stableId = preResourceId + `/instances`;
            const instances = preResource.value as Instances;
            if (needsUpdate) {
                const instancesData = instances.instancesData;
                if (instancesData.stage !== 'author') {
                    throw new Error("Expected author stage for instances data");
                }
                const instancesBlob = instancesData.data();
                const instancesBlobId = crypto.randomUUID();
                blobs[instancesBlobId] = instancesBlob;
                newBlobMap[instances_stableId] = instancesBlobId;
                instances.instancesData = {
                    stage: 'render',
                    data: instancesBlobId
                };
            } else {
                newBlobMap[instances_stableId] = existingBlobMap[instances_stableId];
                instances.instancesData = {
                    stage: 'render',
                    data: existingBlobMap[instances_stableId]
                };
            }
        }
        if (preResourceType === "uniforms") {
            const uniforms_stableId = preResourceId + `/uniforms`;
            const uniforms = preResource.value as Uniforms;
            if (needsUpdate) {
                const uniformsData = uniforms.uniformsData;
                if (uniformsData.stage !== 'author') {
                    throw new Error("Expected author stage for uniforms data");
                }
                const uniformsBlob = uniformsData.data();
                const uniformsBlobId = crypto.randomUUID();
                blobs[uniformsBlobId] = uniformsBlob;
                newBlobMap[uniforms_stableId] = uniformsBlobId;
                uniforms.uniformsData = {
                    stage: 'render',
                    data: uniformsBlobId
                };
            } else {
                newBlobMap[uniforms_stableId] = existingBlobMap[uniforms_stableId];
                uniforms.uniformsData = {
                    stage: 'render',
                    data: existingBlobMap[uniforms_stableId]
                };
            }
        }
        if (preResourceType === "input-texture") {
            const inputTexture_stableId = preResourceId + `/input-texture`;
            const inputTexture = preResource.value as InputTexture;
            if (needsUpdate) {
                const inputTextureData = inputTexture.textureData;
                if (inputTextureData.stage !== 'author') {
                    throw new Error("Expected author stage for input texture data");
                }
                const inputTextureBlob = inputTextureData.data();
                const inputTextureBlobId = crypto.randomUUID();
                blobs[inputTextureBlobId] = inputTextureBlob;
                newBlobMap[inputTexture_stableId] = inputTextureBlobId;
                inputTexture.textureData = {
                    stage: 'render',
                    data: inputTextureBlobId
                };
            } else {
                newBlobMap[inputTexture_stableId] = existingBlobMap[inputTexture_stableId];
                inputTexture.textureData = {
                    stage: 'render',
                    data: existingBlobMap[inputTexture_stableId]
                };
            }
        } 
    }

    return [blobs, newDependencyArrays, newBlobMap];
}

export default resolveBlobsAndResources;