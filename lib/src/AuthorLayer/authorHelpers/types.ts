type AssetRegistry = {
    graphId: string;
    blobIds: string[];
};

type BlobMap = {
    [blobStableId: string]: string
};

type DependencyArrays = {
    [preResourceId: string]: any[]
};

export type {
    AssetRegistry,
    BlobMap,
    DependencyArrays
}