import type { DrawOp, Instances, InstanceSignature, RotatingTexture, Texture, TextureSignature, Uniforms, UniformSignature, VertexSignature, Vertices } from "../../Types/VirtualResources";
import PreResource from "../PreResourceBase";


function VerticesFactory(sig: Partial<VertexSignature>, value: {
    triangleCount: number;
    vertices: () => any[];
    indices: () => number[];
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
        triangleCount: value.triangleCount,
        verticesData: {
            stage: 'author',
            data: () => {
                const vArray = value.vertices();
                const attributeArray : { [key: string]: any[] } = {};
                for (const attrName in sig.attributes) {
                    attributeArray[attrName] = vArray.map(v => typeof v[attrName] === 'number' ? [v[attrName]] : v[attrName]);
                    attributeArray[attrName] = attributeArray[attrName].flat();
                }
                return attributeArray;
            }
        },
        indicesData: {
            stage: 'author',
            data: () => value.indices()
        }
    };
    return new PreResource(val, deps);
}


export default VerticesFactory;