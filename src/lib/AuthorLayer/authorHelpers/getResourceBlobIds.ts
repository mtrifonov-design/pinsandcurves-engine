import type { InputTexture, Instances, Uniforms, Vertices, VirtualResourceGraph } from "../../Types/VirtualResources";

function getResourceBlobIds(resourceId: string, graph: VirtualResourceGraph): string[] {
    const blobIds: string[] = [];
    const resource = graph[resourceId];
    if (!resource) {
        throw new Error(`Resource with ID ${resourceId} not found in graph`);
    }
    switch (resource.signature.type) {
        case "vertices":
            blobIds.push((resource as Vertices).verticesData.data as string);
            blobIds.push((resource as Vertices).indicesData.data as string);
            break;
        case "instances":
            blobIds.push((resource as Instances).instancesData.data as string);
            break;
        case "uniforms":
            blobIds.push((resource as Uniforms).uniformsData.data as string);
            break;
        case "input-texture":
            blobIds.push((resource as InputTexture).textureData.data as string)
            break;
        case "rotating-texture":
        case "texture":
            break;
        default:
            throw new Error(`Unknown resource type: ${(resource as any).signature.type}`);
    }
    return blobIds;
}
export default getResourceBlobIds;