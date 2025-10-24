import type { RotatingTexture, RotatingTextureSignature, TextureSignature, VirtualResourceGraph } from "../../Types/VirtualResources";
import derivePhysicalResourceId from "../RenderHelpers/derivePhysicalResourceId";
import type { PhysicalResourceMap, RenderGraphAssets, TextureLifetimesMap } from "../RenderHelpers/types";
import getTransientTextureId from "./getTransientTextureId";
import type GPUBackend from "./gpuBackend";
import performDrawOp from "./performDrawOp";
import type { TextureProvider } from "./WebGLProviders";


function performRenderPass(
    resId: string,
    graph: VirtualResourceGraph,
    prm: PhysicalResourceMap,
    tlm: TextureLifetimesMap,
    gpuBackend: GPUBackend,
    renderPassIdx: number,
    assets: RenderGraphAssets
) {
    const gl = gpuBackend.gl;
    // First, we set up the attachments for the render pass
    // Fetch the virtual resource that is our render target
    const tr = graph[resId] as RotatingTexture | Texture;
    const trSignature = tr.signature as RotatingTextureSignature | TextureSignature;
    const isRotating = trSignature.type === "rotating-texture";
    const trPhysicalId = derivePhysicalResourceId(resId, trSignature, isRotating ? 0 : undefined);
    const trPhysicalResourceId = isRotating 
        ? prm.namedResources[trPhysicalId].gpuResource
        : getTransientTextureId(
            resId,
            trSignature as TextureSignature,
            prm,
            tlm,
            renderPassIdx,
            0,
        );
    const trPhysicalResource = gpuBackend.getResource(trPhysicalResourceId) as TextureProvider;
    
    gl.viewport(0, 0, trSignature.width, trSignature.height);
    gl.bindFramebuffer(gl.FRAMEBUFFER, trPhysicalResource.framebuffer);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    const floatFormats = ["r32f","r16f", "rgba32f", "rgba16f"];
    if (floatFormats.includes(trSignature.format)) {
        gl.disable(gl.BLEND);
        gl.disable(gl.DEPTH_TEST);
    }

    let drawOpIdx = 0;
    for (const drawOp of tr.drawOps) {
        performDrawOp(
            drawOp,
            renderPassIdx,
            drawOpIdx,
            graph,
            prm,
            gpuBackend,
            tlm,
            assets,
        );
        drawOpIdx++;
    }

}

export default performRenderPass;