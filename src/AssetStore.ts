

class AssetStore {
    private store: Map<string, any>;
    private entryPointId: string | null = null;
    
    constructor() {
        this.store = new Map<string, any>();
    }

    transaction(
        addedAssets: { [assetId: string]: any },
        deletedAssetIds: string[],
        entryPointId: string
    ) {
        for (const assetId of deletedAssetIds) {
            this.store.delete(assetId);
        }
        for (const [assetId, asset] of Object.entries(addedAssets)) {
            this.store.set(assetId, asset);
        }
        this.entryPointId = entryPointId;
        this.emitUpdate();
    }

    private subscribers: Set<(store: Map<string, any>, entryPointId: string) => void> = new Set();
    subscribe(callback: (store: Map<string, any>, entryPointId: string) => void) {
        this.subscribers.add(callback);
        return () => {
            this.subscribers.delete(callback);
        }
    }

    private emitUpdate() {
        for (const callback of this.subscribers) {
            callback(this.store, this.entryPointId!);
        }
    }
}

export default AssetStore;