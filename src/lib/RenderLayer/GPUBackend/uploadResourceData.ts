import type { VirtualResource, VirtualResourceGraph } from "../../Types/VirtualResources";
import derivePhysicalResourceId from "../RenderHelpers/derivePhysicalResourceId";
import type { RenderGraphAssets } from "../RenderHelpers/types";
import type GPUBackend from "./gpuBackend";
import { InstanceProvider, TextureProvider, UniformProvider, VertexProvider } from "./WebGLProviders";

function uploadResourceData(
    resourceId: string,
    resource: VirtualResource,
    graph: VirtualResourceGraph,
    assets: RenderGraphAssets,
    gpuBackend: GPUBackend,
) {
    const physicalResourceId = derivePhysicalResourceId(resourceId, resource.signature);
    const physicalResource = gpuBackend.getResource(physicalResourceId);
    switch (resource.signature.type) {
        case "vertices":
            if (!(physicalResource instanceof VertexProvider)) throw new Error(`uploadResourceData: Expected ${resourceId} to be VertexProvider.`);
            const vertexData = assets[resource.verticesData.resource];
            const indicesData = assets[resource.indicesData.resource];
            physicalResource.setVertexData(vertexData);
            physicalResource.setIndexData(indicesData);
            break;
        case "instances":
            if (!(physicalResource instanceof InstanceProvider)) throw new Error(`uploadResourceData: Expected ${resourceId} to be InstanceProvider.`);
            const instancesData = assets[resource.instancesData.resource];
            physicalResource.setInstanceData(instancesData);
            break;
        case "uniforms":
            if (!(physicalResource instanceof UniformProvider)) throw new Error(`uploadResourceData: Expected ${resourceId} to be UniformProvider.`);
            const uniformsData = assets[resource.uniformsData.resource];
            physicalResource.setUniforms(uniformsData);
            break;
        case "input-texture":
            if (!(physicalResource instanceof TextureProvider)) throw new Error(`uploadResourceData: Expected ${resourceId} to be TextureProvider.`);
            const textureData = assets[resource.textureData.resource];
            physicalResource.setData(textureData);
            break;
        default:
            throw new Error(`uploadResourceData: Not an input resource. Wrong resource signature type ${(resource as any).signature.type}`);
    }
}

export default uploadResourceData;