import type { RotatingTexture, VirtualResource, Texture } from "../../Types/VirtualResources";

type DirtyResourceMap = {
    [resourceId: string]: boolean;
}

type PhysicalResourceDescriptor = {
    signature: VirtualResource['signature'];
    gpuResource: any; 
    persistent: boolean;
}

type PhysicalResourcePoolDescriptor = {
    signature: VirtualResource['signature'];
    gpuResources: any[];
}

type RequiredPhysicalResourcesMap = {
    namedResources: {
        [resourceId : string]: VirtualResource['signature']
    };
    freeResources: {
        [resourceId : string]: [VirtualResource['signature'], number]
    };
}

type PhysicalResourceMap = {
    namedResources: {
        [resourceId : string]: PhysicalResourceDescriptor
    };
    freeResources: {
        [resourceId : string]: PhysicalResourcePoolDescriptor
    };
}

type RenderPassSequence = [string,(Texture | RotatingTexture)][];

type TextureLifetimesMap = {
    [transientTextureId: string]: {
        firstUseRenderPassIdx: number;
        lastUseRenderPassIdx: number;
        firstUseDrawOpIdx: number;
        lastUseDrawOpIdx: number;
    }
}


export type {
    DirtyResourceMap,
    PhysicalResourceMap,
    RequiredPhysicalResourcesMap,
    RenderPassSequence,
    TextureLifetimesMap
}