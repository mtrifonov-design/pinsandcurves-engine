import type { VirtualResourceGraph } from "../../Types/VirtualResources";
import derivePhysicalResourceId from "../RenderHelpers/derivePhysicalResourceId";
import type { PhysicalResourceMap } from "../RenderHelpers/types";
import type GPUBackend from "./gpuBackend";
import type { TextureProvider } from "./WebGLProviders";
function blitToScreen(
    gpuBackend : GPUBackend,
    physicalResourceMap : PhysicalResourceMap,
    graph: VirtualResourceGraph,
    targetTexture : string,
) {
    const res = graph[targetTexture];
    const signature = res.signature;
    const physicalId = derivePhysicalResourceId(targetTexture,signature);
    const handleId = physicalResourceMap.namedResources[physicalId].gpuResource;
    const textureProvider = gpuBackend.getResource(handleId) as TextureProvider;

    const gl = gpuBackend.gl;
    gl.bindFramebuffer(
        gl.READ_FRAMEBUFFER,
        textureProvider.framebuffer,
    );
    gl.bindFramebuffer(
        gl.DRAW_FRAMEBUFFER,
        null,
    );
    const canvas = gl.canvas;
    gl.blitFramebuffer(
        0,
        0,
        signature.width,
        signature.height,
        0,
        0,
        canvas.width,
        canvas.height,
        gl.COLOR_BUFFER_BIT,
        gl.NEAREST,
    )
}

export default blitToScreen;