import type { RotatingTexture, VirtualResource, Texture, VertexSignature, InstanceSignature, UniformSignature } from "../../Types/VirtualResources";

type DirtyResourceMap = {
    [resourceId: string]: boolean;
}

type PhysicalResourceDescriptor = {
    signature: VirtualResource['signature'];
    gpuResource: string; 
    persistent: boolean;
}

type PhysicalSignature = 
| VirtualResource['signature']
| {
    type: 'program';
    vertexSignature: VertexSignature;
    instanceSignature?: InstanceSignature;
    uniformSignatures: {[bindingName: string]: UniformSignature};
    textures: {
        [textureSlot: string]: {
            textureSignature: VirtualResource['signature'];
            sampler: {
                filter: 'nearest' | 'linear';
                wrap: 'clamp-to-edge' | 'repeat' | 'mirror-repeat';
            }
        }
    }
}

type PhysicalResourcePoolDescriptor = {
    signature: PhysicalSignature;
    gpuResources: string[];
}

type RequiredPhysicalResourcesMap = {
    namedResources: {
        [resourceId : string]: PhysicalSignature
    };
    freeResources: {
        [resourceId : string]: [PhysicalSignature, number]
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
    TextureLifetimesMap,
    PhysicalSignature,
}