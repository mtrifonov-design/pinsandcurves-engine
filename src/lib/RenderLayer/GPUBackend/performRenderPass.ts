import type { VirtualResourceGraph } from "../../Types/VirtualResources";
import type { PhysicalResourceMap, TextureLifetimesMap } from "../RenderHelpers/types";
import type GPUBackend from "./gpuBackend";


function performRenderPass(
    resId: string,
    graph: VirtualResourceGraph,
    prm: PhysicalResourceMap,
    tlm: TextureLifetimesMap,
    gpuBackend: GPUBackend,
) {
    // First, we set up the attachments for the render pass
    // 
}

export default performRenderPass;