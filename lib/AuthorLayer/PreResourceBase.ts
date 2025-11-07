import type { VirtualResource } from "../Types/VirtualResources";

class PreResource {
    value: VirtualResource;
    dependencyArray: any[] = [];
    
    constructor(value: VirtualResource, dependencyArray: any[] = []) {
        this.value = value;
        this.dependencyArray = dependencyArray;
    }

    __id?: string;
    get id() {
        if (!this.__id) {
            throw new Error("PreResource id not set yet");
        }
        return this.__id;
    }

    setId(id: string) {
        this.__id = id;
    };
};

export default PreResource;