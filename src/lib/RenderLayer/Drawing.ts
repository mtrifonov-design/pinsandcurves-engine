import markDirtyResources from "./RenderHelpers/markDirtyResources";
import type { DirtyResourceMap } from "./RenderHelpers/types";

class Drawing {

    constructor(gl: WebGL2RenderingContext) {}

    private assets : any;
    private graphId? : string;
    private dirtyResources : DirtyResourceMap = {};
    submit(graphId, assets) {
        const oldGraphId = this.graphId;
        const oldAssets = this.assets;
        // store the graph id and assets
        this.graphId = graphId;
        const graph = relabelResourceIds(assets[graphId]);
        this.assets = assets;

        // perform the "dirty" marking of resources
        const dirtyResources = markDirtyResources(oldGraphId ? oldAssets[oldGraphId] : {}, assets[graphId], this.dirtyResources);
        this.dirtyResources = dirtyResources;
    }

    private synchronize() {
        if (!this.graphId || !this.assets) throw new Error("No assets submitted to Drawing");
        const graph = this.assets[this.graphId];

        const requiredPhysicalResourceMap = determineRequiredPhysicalResources(graph);


        // synchronize logical resources with GPU resources
        // produce a map of required GPU resources
        // allocate/release GPU resources as needed
    }

    private materialize(targetTexture) {}
    private readback(targetTexture) {}
    capture(targetTexture) {
        this.synchronize();
        this.materialize(targetTexture);
        return this.readback(targetTexture);
    }

    private blit(targetTexture) {}
    draw(targetTexture) {
        this.synchronize();
        this.materialize(targetTexture);
        this.blit(targetTexture);
    }
}

export default Drawing;