import type { RotatingTexture, VirtualResource, Texture, VertexSignature, InstanceSignature, UniformSignature, VirtualResourceGraph } from "../../Types/VirtualResources";

type DirtyResourceMap = {
    [resourceId: string]: boolean;
}

type PhysicalResourceDescriptor = {
    signature: PhysicalSignature;
    gpuResource: string; 
    persistent: boolean;
}

type PhysicalProgramSignature = {
    type: 'program';
    vertexShader: string;
    fragmentShader: string;
    vertexSignature: VertexSignature;
    instanceSignature?: InstanceSignature;
    uniformSignatures: {[bindingName: string]: UniformSignature};
    textures: {
        [textureSlot: string]: {
            textureSignature: VirtualResource['signature'];
            // the sampler information might be a mistake to include here
            sampler: {
                filter: 'nearest' | 'linear';
                wrap: 'clamp-to-edge' | 'repeat' | 'mirror-repeat';
            }
        }
    }
}

type PhysicalSignature = 
| VirtualResource['signature']
| PhysicalProgramSignature

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


type RenderGraphAssets = {
    [graphId: string]: VirtualResourceGraph | any;
}


export type {
    DirtyResourceMap,
    PhysicalResourceMap,
    RequiredPhysicalResourcesMap,
    RenderPassSequence,
    TextureLifetimesMap,
    PhysicalSignature,
    RenderGraphAssets,
    PhysicalProgramSignature
}