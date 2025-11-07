import type { DrawOp, InputTextureSignature, RotatingTexture, RotatingTextureSignature, Texture, TextureSignature} from "../../Types/VirtualResources";
import PreResource from "../PreResourceBase";


function TextureFactory(sig: Partial<TextureSignature | RotatingTextureSignature | InputTextureSignature>, drawOps: Function | DrawOp[], deps: any[]) {
    if ("historyLength" in sig && sig.historyLength > 1) {
        return RotatingTextureFactory(sig, drawOps, deps);
    } else if (typeof drawOps === 'function') {
        return InputTextureFactory(sig, drawOps as any, deps);
    } else {
        return TransientTextureFactory(sig, drawOps, deps);
    }
}

function TransientTextureFactory(sig: Partial<TextureSignature>, drawOps: DrawOp[], deps: any[]) {
    const defaultSignature: TextureSignature = {
        type: 'texture',
        format: "rgba8",
        width: 256,
        height: 256,
    };
    sig = { ...defaultSignature, ...sig };
    const val : Texture = {
        signature: sig,
        drawOps: drawOps
    };
    return new PreResource(val, deps);
}

function RotatingTextureFactory(sig: Partial<RotatingTextureSignature>, drawOps: DrawOp[], deps: any[]) {
    const defaultSignature: RotatingTextureSignature = {
        type: 'rotating-texture',
        format: "rgba8",
        width: 256,
        height: 256,
        historyLength: 2,
    };
    sig = { ...defaultSignature, ...sig };
    const val : RotatingTexture = {
        signature: sig,
        drawOps: drawOps
    };
    return new PreResource(val, deps);
}

function InputTextureFactory(sig: Partial<InputTextureSignature>, value: () => ArrayBuffer, deps: any[]) {
    const defaultSignature: InputTextureSignature = {
        type: 'input-texture',
        format: "rgba8",
        width: 256,
        height: 256,
    };
    sig = { ...defaultSignature, ...sig };
    const val : Texture = {
        signature: sig,
        inputTextureData: {
            stage: 'author',
            data: value
        }
    };
    return new PreResource(val, deps);
}
export default TextureFactory;