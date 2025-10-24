import type { DrawOp, VirtualResourceGraph } from "../../../Types/VirtualResources";
import derivePhysicalResourceId from "../../RenderHelpers/derivePhysicalResourceId";
import deriveProgramSignature from "../../RenderHelpers/deriveProgramSignature";
import type { PhysicalResourceMap, RenderGraphAssets, TextureLifetimesMap } from "../../RenderHelpers/types";
import type GPUBackend from "../gpuBackend";
import type { ProgramProvider, TextureProvider } from "../WebGLProviders";

function setupTextures(
    gpuBackend: GPUBackend,
    graph: VirtualResourceGraph,
    drawOp: DrawOp,
    prm: PhysicalResourceMap,
    tlm: TextureLifetimesMap,
    renderPassIdx: number,
    drawOpIdx: number,
    assets: RenderGraphAssets,
) {

    const programSignature = deriveProgramSignature(drawOp, graph, assets);
    const programId = derivePhysicalResourceId("program",programSignature);
    const programId_g = prm.namedResources[programId].gpuResource;
    const programProvider = gpuBackend.getResource(programId_g);

    const textures = drawOp.textures;
    let slot = 0;
    for (const [bindingName, textureValue] of Object.entries(textures)) {
        
        setupTexture(
            bindingName,
            textureValue,
            slot,
            gpuBackend,
            graph,
            drawOp,
            prm,
            tlm,
            renderPassIdx,
            drawOpIdx,
            programProvider
        );
        slot++;
    }
}

function setupTexture(
    bindingName: string,
    textureValue: DrawOp["textures"],
    slot : number,
    gpuBackend: GPUBackend,
    graph: VirtualResourceGraph,
    drawOp: DrawOp,
    prm: PhysicalResourceMap,
    tlm: TextureLifetimesMap,
    renderPassIdx: number,
    drawOpIdx: number,
    programProvider: ProgramProvider,
) {

    const gl = gpuBackend.gl;

    const textureId = textureValue.texture.resource as string;

    // we want to get to the texture provider
    const texSig = graph[textureId].signature;
    const ptid = derivePhysicalResourceId(textureId,texSig);
    const ptid_g = prm.namedResources[ptid].gpuResource;
    const texProvider = gpuBackend.getResource(ptid_g) as TextureProvider;

    const location = gl.getUniformLocation(programProvider.program,bindingName);
    if (location === null) throw new Error ("Something went wrong")
    gl.activeTexture(gl.TEXTURE0+slot);
    gl.bindTexture(gl.TEXTURE_2D, texProvider.texture);
    const sampler = textureValue.sampler;
    const filter = sampler.filter === "linear" ? gl.LINEAR : gl.NEAREST;
    const wrap = sampler.wrap === "repeat" ? gl.REPEAT : gl.CLAMP_TO_EDGE;

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);

    gl.uniform1i(location, slot);
}

export default setupTextures;