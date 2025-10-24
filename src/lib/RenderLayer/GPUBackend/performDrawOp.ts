import type { DrawOp, Instances, Vertices, VirtualResourceGraph } from "../../Types/VirtualResources";
import derivePhysicalResourceId from "../RenderHelpers/derivePhysicalResourceId";
import deriveProgramSignature from "../RenderHelpers/deriveProgramSignature";
import type { PhysicalResourceMap, RenderGraphAssets, TextureLifetimesMap } from "../RenderHelpers/types";
import type GPUBackend from "./gpuBackend";
import setupTextures from "./WebGLDrawOpSetup/setupTextures";
import setupUniforms from "./WebGLDrawOpSetup/setupUniforms";
import setupVerticesAndInstances from "./WebGLDrawOpSetup/setupVerticesAndInstances";
import type { ProgramProvider } from "./WebGLProviders";


function performDrawOp(
    drawOp: DrawOp,
    renderPassIdx: number,
    drawOpIdx: number,
    graph: VirtualResourceGraph,
    prm: PhysicalResourceMap,
    gpuBackend: GPUBackend,
    tlm: TextureLifetimesMap,
    assets: RenderGraphAssets
) {
    const gl = gpuBackend.gl;
    const vertices = graph[drawOp.vertices.resource as string] as Vertices;
    const instanced = drawOp.instances !== undefined;
    const instances = instanced ? graph[drawOp.instances!.resource as string] as Instances : undefined;
    setupVerticesAndInstances(
        gpuBackend,
        graph,
        drawOp.vertices.resource as string,
        drawOp.instances?.resource as string | undefined,
        prm,
    )

    setupUniforms(
        gpuBackend,
        graph,
        drawOp,
        prm,
        assets,
    )

    setupTextures(
        gpuBackend,
        graph,
        drawOp,
        prm,
        tlm,
        renderPassIdx,
        drawOpIdx,
        assets,
    )

    const programSignature = deriveProgramSignature(drawOp, graph, assets);
    const programId = derivePhysicalResourceId('program', programSignature);
    const programRId = prm.namedResources[programId].gpuResource;
    const programProvider = gpuBackend.getResource(programRId) as ProgramProvider;
    gl.useProgram(programProvider.program as WebGLProgram);

    if (instanced) {    
        gl.drawElementsInstanced(
            gl.TRIANGLES,
            vertices.triangleCount * 3,
            gl.UNSIGNED_SHORT,
            0,
            (instances as Instances).instanceCount,
        )
    } else {
        gl.drawElements(
            gl.TRIANGLES,
            vertices.triangleCount * 3,
            gl.UNSIGNED_SHORT,
            0,
        )
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

export default performDrawOp;