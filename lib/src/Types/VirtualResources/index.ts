// Signatures start here

import type PreResource from "../../AuthorLayer/PreResourceBase";

type VertexSignature = {
    type: "vertices";
    attributes: {
        [attributeName: string]: 'float' | 'int' | 'vec2' | 'vec4';
    };
    maxVertexCount: number;
    maxTriangleCount: number;
};
type InstanceSignature = {
    type: "instances";
    attributes: {
        [attributeName: string]: 'float' | 'int' | 'vec2' | 'vec4';
    };
    maxInstanceCount: number;
};
type UniformSignature = {
    type: "uniforms";
    bindings: {
        [bindingName: string]: 'float' | 'int' | 'vec2' | 'vec4' | 'mat4';
    };
};
type RotatingTextureSignature = {
    type: "rotating-texture";
    width: number;
    height: number;
    format: 'rgba8' | 'rgba16f' | 'rgba32f';
    historyLength: number;
};
type InputTextureSignature = {
    type: "input-texture";
    width: number;
    height: number;
    format: 'rgba8' | 'rgba16f' | 'rgba32f';
};
type TextureSignature = {
    type: "texture";
    width: number;
    height: number;
    format: 'rgba8' | 'rgba16f' | 'rgba32f';
};
// Signatures end here

type BlobInput = 
|{
    stage: 'author',
    data: () => any;
} 
|{
    stage: 'render',
    data: string;
}


type Vertices = {
    signature: VertexSignature;
    triangleCount: number;
    verticesData: BlobInput;
    indicesData: BlobInput;
};
type Instances = {
    signature: InstanceSignature;
    instanceCount: number;
    instancesData: BlobInput;
};
type Uniforms = {
    signature: UniformSignature;
    uniformsData: BlobInput;
};
type InputTexture = {
    signature: InputTextureSignature;
    textureData: BlobInput;
};

type DependencySlot = 
| {
    stage: 'author',
    resource: PreResource;
}
| {
    stage: 'render',
    resource: string;
}

type DrawOp = {
    vertices: DependencySlot;
    instances?: DependencySlot;
    uniforms: {
        [bindingName: string]: DependencySlot;
    };
    textures: {
        [bindingName: string]: {
            texture: DependencySlot;
            sampler: {
                filter: 'nearest' | 'linear';
                wrap: 'clamp-to-edge' | 'repeat' | 'mirror-repeat';
            }
        };
    };
    blendMode?: 'alpha' | 'additive' | 'opaque';
    depthTest?: boolean;
    vertexShaderData: BlobInput;
    fragmentShaderData: BlobInput;
};

type RotatingTexture = {
    signature: RotatingTextureSignature;
    drawOps: DrawOp[];
};
type Texture = {
    signature: TextureSignature;
    drawOps: DrawOp[];
};

type VirtualResource = Vertices | Instances | Uniforms | InputTexture | RotatingTexture | Texture;
type VirtualResourceGraph = {
    [resourceName: string]: VirtualResource;
};

export type {
    VertexSignature,
    InstanceSignature,
    UniformSignature,
    RotatingTextureSignature,
    InputTextureSignature,
    TextureSignature,
    Vertices,
    Instances,
    Uniforms,
    InputTexture,
    DrawOp,
    RotatingTexture,
    Texture,
    VirtualResource,
    VirtualResourceGraph
};