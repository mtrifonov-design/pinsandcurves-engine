import markDirtyResources from "./RenderHelpers/markDirtyResources";
import type { DirtyResourceMap, PhysicalResourceMap } from "./RenderHelpers/types";
import determineRequiredPhysicalResources from "./RenderHelpers/determineRequiredPhysicalResources";
import synchronizePhysicalResources from "./GPUBackend/synchronizePhysicalResources";
import clearInputNodes from "./GPUBackend/clearInputNodes";
import performRenderPasses from "./GPUBackend/performRenderPasses";
import blitToScreen from "./GPUBackend/blitToScreen";

class Drawing {

    private GPUBackend : unknown;
    constructor(gpuBackend : unknown) {
        this.GPUBackend = gpuBackend;
    }

    private assets : any;
    private graphId? : string;
    private dirtyResources : DirtyResourceMap = {};
    submit(graphId, assets) {
        const oldGraphId = this.graphId;
        const oldAssets = this.assets;
        // store the graph id and assets
        this.graphId = graphId;
        this.assets = assets;

        // perform the "dirty" marking of resources
        const dirtyResources = markDirtyResources(oldGraphId ? oldAssets[oldGraphId] : {}, assets[graphId], this.dirtyResources);
        this.dirtyResources = dirtyResources;
    }

    private physicalResourceMap : PhysicalResourceMap = {
        namedResources: {},
        freeResources: {}
    }
    private synchronize(targetTexture : string) {
        if (!this.graphId || !this.assets) throw new Error("No assets submitted to Drawing");
        const graph = this.assets[this.graphId];
        const requiredPhysicalResourceMap = determineRequiredPhysicalResources(graph,targetTexture);
        this.physicalResourceMap = synchronizePhysicalResources(
            this.physicalResourceMap,
            requiredPhysicalResourceMap,
            this.GPUBackend,
        )
    }

    private materialize(targetTexture : string) {
        if (!this.graphId || !this.assets) throw new Error("No assets submitted to Drawing");
        // materialization proceeds in two stages:
        {
        // 1. start by clearing dirty input nodes by uploading new data to GPU.
        const dr = clearInputNodes(
            this.assets,
            this.graphId,
            targetTexture,
            this.physicalResourceMap,
            this.dirtyResources,
            this.GPUBackend,
        )
        this.dirtyResources = dr;
        }
        {
        // 2. then, perform draw calls alongst the render pass sequence to update all other resources.
        const [dr,prm] = performRenderPasses(
            this.assets,
            this.graphId,
            targetTexture,
            this.physicalResourceMap,
            this.dirtyResources,
            this.GPUBackend,
        )
        this.dirtyResources = dr;
        this.physicalResourceMap = prm;
        }
    }
    private readback(targetTexture : string) {
        // todo
    }
    capture(targetTexture : string) {
        this.synchronize(targetTexture);
        this.materialize(targetTexture);
        return this.readback(targetTexture);
    }

    private blit(targetTexture : string) {
        blitToScreen(
            this.GPUBackend,
            this.physicalResourceMap,
            targetTexture,
        )
    }
    draw(targetTexture : string) {
        this.synchronize(targetTexture);
        this.materialize(targetTexture);
        this.blit(targetTexture);
    }
}

export default Drawing;