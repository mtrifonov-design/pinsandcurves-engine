import type { VirtualResourceGraph } from "../../src/Types/VirtualResources";
import derivePhysicalResourceId from "../RenderHelpers/derivePhysicalResourceId";
import type { PhysicalResourceMap } from "../RenderHelpers/types";
import type GPUBackend from "./gpuBackend";
import type { TextureProvider } from "./WebGLProviders";
function readbackTexture(
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
        gl.FRAMEBUFFER,
        textureProvider.framebuffer,
    );
    const width = signature.width;
    const height = signature.height;
    const pixels = new Uint8Array(width * height * 4);
    gl.readPixels(
        0,
        0,
        width,
        height,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        pixels,
    );
    gl.bindFramebuffer(
        gl.FRAMEBUFFER,
        null,
    );
    // flip the pixels vertically
    const rowSize = width * 4;
    for (let y = 0; y < Math.floor(height / 2); y++) {
        const topOffset = y * rowSize;
        const bottomOffset = (height - y - 1) * rowSize;
        for (let x = 0; x < rowSize; x++) {
            const temp = pixels[topOffset + x];
            pixels[topOffset + x] = pixels[bottomOffset + x];
            pixels[bottomOffset + x] = temp;
        }
    }
    return pixels;
}

export default readbackTexture;