import type { DrawOp, Instances, InstanceSignature, RotatingTexture, Texture, TextureSignature, Uniforms, UniformSignature, VertexSignature, Vertices } from "../../Types/VirtualResources";
import PreResource from "../PreResourceBase";


function UniformsFactory(sig: { [key:string] : any }, value: () => { [uniformName: string]: any }, deps: any[]) {
    const defaultSignature: UniformSignature = {
        type: 'uniforms',
        bindings: sig || {}
    };
    const val : Uniforms = {
        signature: defaultSignature,
        uniformsData: {
            stage: 'author',
            data: value
        }
    };
    return new PreResource(val, deps);
}
export default UniformsFactory;