import type { PreResourceGraph } from "./types";
import type { AssetRegistry, BlobMap, DependencyArrays } from "./authorHelpers/types";
import flattenPrg from "./authorHelpers/flattenPrg";
import resolveDependencies from "./authorHelpers/resolveDependencies";
import resolveBlobsAndResources from "./authorHelpers/resolveBlobsAndResources";
import type { VirtualResourceGraph } from "../Types/VirtualResources";

class Blueprint {
    assetRegistry: AssetRegistry = { graphId: "", blobIds: [] };
    blobMap: BlobMap = {};
    dependencyArrays: DependencyArrays = {};
    graph: VirtualResourceGraph = {};

    constructor() {}
    update(prg: PreResourceGraph) {
        const flattenedPrg = flattenPrg(prg);
        resolveDependencies(flattenedPrg);
        const [blobs, newDependencyArrays, newBlobMap] = resolveBlobsAndResources(
            flattenedPrg, 
            this.graph,
            this.dependencyArrays,
            this.blobMap
        );
        this.dependencyArrays = newDependencyArrays;
        this.blobMap = newBlobMap;

        const newGraphId = crypto.randomUUID();
        const graph : VirtualResourceGraph = {};
        for (const [preResourceId, preResource] of Object.entries(flattenedPrg)) {
            graph[preResourceId] = preResource.value;
        }

        // update asset registry
        this.assetRegistry = {
            graphId: newGraphId,
            blobIds: Object.keys(blobs)
        }
        // return asset registry, graph and blobs

        // TODO. add a validation step.
        // Validate that blobs are the correct shape according to the signatures in the graph.
        // Validate that ... 

        return {
            assetRegistry: this.assetRegistry,
            assets: { ...blobs, [newGraphId]: graph }
        }
    }
}

export default Blueprint;