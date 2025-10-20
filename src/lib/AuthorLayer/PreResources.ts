import type { DrawOp, Instances, InstanceSignature, TextureSignature, UniformSignature, VertexSignature, Vertices } from "../Types/VirtualResources";
import PreResource from "./PreResourceBase";


function VerticesFactory(sig: Partial<VertexSignature>, value: {
    count: number;
    vertices: () => Float32Array;
    indices: () => Uint16Array;
}, deps: any[]) {
    const defaultSignature: VertexSignature = {
        type: 'vertices',
        attributes: {},
        maxVertexCount: 1000,
        maxTriangleCount: 1000,
    };
    sig = { ...defaultSignature, ...sig };
    const val : Vertices = {
        signature: sig,
        vertexCount: value.count,
        verticesData: {
            stage: 'author',
            data: value.vertices
        },
        indicesData: {
            stage: 'author',
            data: value.indices
        }
    };
    return new PreResource(val, deps);
}
function InstancesFactory(sig: Partial<InstanceSignature>, value: {
    count: number;
    instances: () => Float32Array;
}, deps: any[]) {
    const defaultSignature: InstanceSignature = {
        type: 'instances',
        maxInstanceCount: 1000,
        attributes: {},
    };
    sig = { ...defaultSignature, ...sig };
    const val : Instances = {
        signature: sig,
        instanceCount: value.count,
        instancesData: {
            stage: 'author',
            data: value.instances
        }
    };
    return new PreResource(val, deps);
}
function uniformsFactory(sig: Partial<UniformSignature>, value: { [uniformName: string]: any }, deps: any[]) {
    const defaultSignature: UniformSignature = {
        type: 'uniforms',
        attributes: {}
    };
    sig = { ...defaultSignature, ...sig };
    const val : Instances = {
        signature: sig,
        uniformsData: {
            stage: 'author',
            data: value
        }
    };
    return new PreResource(val, deps);
}
function TextureFactory(sig: Partial<TextureSignature>, drawOps: DrawOp[], deps: any[]) {
    const defaultSignature: TextureSignature = {
        type: 'texture',
        format: "rgba8",
        width: 256,
        height: 256,
    };
    sig = { ...defaultSignature, ...sig };
    const val : Instances = {
        signature: sig,
        drawOps: drawOps
    };
    return new PreResource(val, deps);
}


export {
    VerticesFactory,
    InstancesFactory,
    uniformsFactory,
    TextureFactory
};