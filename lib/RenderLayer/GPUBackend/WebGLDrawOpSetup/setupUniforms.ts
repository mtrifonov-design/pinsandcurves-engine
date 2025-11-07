import type { DrawOp, VirtualResourceGraph } from "../../../Types/VirtualResources";
import derivePhysicalResourceId from "../../RenderHelpers/derivePhysicalResourceId";
import deriveProgramSignature from "../../RenderHelpers/deriveProgramSignature";
import type { PhysicalResourceMap, RenderGraphAssets } from "../../RenderHelpers/types";
import type GPUBackend from "../gpuBackend";
import type { ProgramProvider, UniformProvider } from "../WebGLProviders";

function setupUniforms(
    gpuBackend: GPUBackend,
    graph: VirtualResourceGraph,
    drawOp: DrawOp,
    prm: PhysicalResourceMap,
    assets: RenderGraphAssets,
) {
    const uniforms = drawOp.uniforms;
    const programSignature = deriveProgramSignature(drawOp, graph, assets);
    const programId = derivePhysicalResourceId('program', programSignature);
    const programRId = prm.namedResources[programId].gpuResource;
    const programProvider = gpuBackend.getResource(programRId) as ProgramProvider;
    const gl = gpuBackend.gl;
    let i = 0;
    for (const [bindingName, uniformDependency] of Object.entries(uniforms)) {
        const uId = uniformDependency.resource as string;
        const uniformResource = graph[uId];
        const uniformSignature = uniformResource.signature;
        const physicalUniformId = derivePhysicalResourceId(uId, uniformSignature);
        const physicalUniformRId = prm.namedResources[physicalUniformId].gpuResource;
        const uniformProvider = gpuBackend.getResource(physicalUniformRId) as UniformProvider;

        gl.bindBuffer(gl.UNIFORM_BUFFER, uniformProvider.buffer);
        gl.bindBufferBase(
            gl.UNIFORM_BUFFER,
            i,
            uniformProvider.buffer,
        );
        const uniformBlockIndex = gl.getUniformBlockIndex(
            programProvider.program as WebGLProgram,
            bindingName,
        );
        gl.uniformBlockBinding(
            programProvider.program as WebGLProgram,
            uniformBlockIndex,
            i,
        );

        i++;
    }

}
export default setupUniforms;