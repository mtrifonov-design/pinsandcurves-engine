import type { PreResourceGraph } from "./types";
import type { AssetRegistry, BlobMap, DependencyArrays } from "./authorHelpers/types";
import flattenPrg from "./authorHelpers/flattenPrg";
import resolveDependencies from "./authorHelpers/resolveDependencies";
import resolveBlobsAndResources from "./authorHelpers/resolveBlobsAndResources";
import type { VirtualResourceGraph } from "../Types/VirtualResources";
import getResourceBlobIds from "./authorHelpers/getResourceBlobIds";

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
        const graphBlobIds = Object.entries(graph).map(([resId, _]) => getResourceBlobIds(resId,graph)).flat(1);
        const existingBlobIds = [...this.assetRegistry.blobIds];
        const unusedBlobIds = existingBlobIds.filter(id => !graphBlobIds.includes(id));

        const assetsForDeletion = [
            this.assetRegistry.graphId, 
            ...unusedBlobIds
        ];

        // update asset registry
        this.assetRegistry = {
            graphId: newGraphId,
            blobIds: graphBlobIds
        }
        // return asset registry, graph and blobs

        // TODO. add a validation step.
        // Validate that blobs are the correct shape according to the signatures in the graph.
        // Validate that ... 

        return {
            graphId: this.assetRegistry.graphId,
            addedAssets: { ...blobs, [newGraphId]: graph },
            deletedAssetIds: assetsForDeletion
        }
    }
}

export default Blueprint;