import type { Instances, Vertices, VirtualResourceGraph } from "../../../Types/VirtualResources";
import derivePhysicalResourceId from "../../RenderHelpers/derivePhysicalResourceId";
import type { PhysicalResourceMap } from "../../RenderHelpers/types";
import type GPUBackend from "../gpuBackend";
import type { InstanceProvider, VertexProvider } from "../WebGLProviders";
import { getBufferRowSize, getPropertyTypeSize, getPropertyTypeType } from "./VertexInstanceUtils";


function setupVerticesAndInstances(
    gpuBackend: GPUBackend,
    graph: VirtualResourceGraph,
    verticesId: string,
    instancesId: string | undefined,
    prm: PhysicalResourceMap,
) {

    const gl = gpuBackend.gl;

    const vSig = (graph[verticesId] as Vertices).signature;
    const vPID = derivePhysicalResourceId(verticesId, vSig);
    const vPID_GPU = prm.namedResources[vPID].gpuResource;
    const vResource = gpuBackend.getResource(vPID_GPU) as VertexProvider;

    gl.bindBuffer(gl.ARRAY_BUFFER, vResource.vertexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vResource.indexBuffer);
    const vertexStructure = vResource.vertexStructureObject;
    for (let i = 0; i < vertexStructure.length; i++) {
        const attribute = vertexStructure[i];
        const location = attribute.layoutIdx;
        gl.vertexAttribPointer(
            location, 
            getPropertyTypeSize(attribute.type), 
            getPropertyTypeType(attribute.type, gl), 
            false, 
            getBufferRowSize(vertexStructure), 
            getBufferRowSize(vertexStructure.slice(0, i)));
        gl.enableVertexAttribArray(location);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    if (!instancesId) return;

    const iSig = (graph[instancesId] as Instances).signature;
    const iPID = derivePhysicalResourceId(instancesId, iSig);
    const iPID_GPU = prm.namedResources[iPID].gpuResource;
    const iResource = gpuBackend.getResource(iPID_GPU) as InstanceProvider;
    const l = vertexStructure.length;
    gl.bindBuffer(gl.ARRAY_BUFFER, iResource.instanceBuffer);
    const instanceStructure = iResource.instanceStructureObject;
        for (let i = 0; i < instanceStructure.length; i++) {
        const attribute = instanceStructure[i];
        const location = l + attribute.layoutIdx;
        gl.vertexAttribPointer(
            location,
            getPropertyTypeSize(attribute.type),
            getPropertyTypeType(attribute.type, gl),
            false,
            getBufferRowSize(instanceStructure),
            getBufferRowSize(instanceStructure.slice(0, i)));
        gl.enableVertexAttribArray(location);
        gl.vertexAttribDivisor(location, 1);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

}

export default setupVerticesAndInstances;