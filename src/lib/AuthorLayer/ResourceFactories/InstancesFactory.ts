import type { DrawOp, Instances, InstanceSignature, RotatingTexture, Texture, TextureSignature, Uniforms, UniformSignature, VertexSignature, Vertices } from "../../Types/VirtualResources";
import PreResource from "../PreResourceBase";


function InstancesFactory(sig: Partial<InstanceSignature>, value: {
    count: number;
    instances: () => any[];
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
            data: () => {
                const iArray = value.instances();
                const attributeArray : { [key: string]: any[] } = {};
                for (const attrName in sig.attributes) {
                    attributeArray[attrName] = iArray.map(i => typeof i[attrName] === 'number' ? [i[attrName]] : i[attrName]);
                    attributeArray[attrName] = attributeArray[attrName].flat();
                }
                return attributeArray;
            }
        }
    };
    return new PreResource(val, deps);
}

export default InstancesFactory;