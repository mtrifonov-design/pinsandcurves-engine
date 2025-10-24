import type { InputTextureSignature, RotatingTextureSignature, TextureSignature } from "../../../Types/VirtualResources";

type TextureType =
    | 'RGBA8'
    | 'R8'
    | 'R32F'
    | 'RGBA32F'

type UploadInfo = {
    internalFormat: number;
    format: number;
    type: number;
};

const getUploadInfo = (t: TextureType, gl: WebGL2RenderingContext): UploadInfo => {
    switch (t) {
        case 'RGBA8':
            return { internalFormat: gl.RGBA8, format: gl.RGBA, type: gl.UNSIGNED_BYTE };
        case 'R8':
            return { internalFormat: gl.R8, format: gl.RED, type: gl.UNSIGNED_BYTE };
        case 'R32F':
            return { internalFormat: gl.R32F, format: gl.RED, type: gl.FLOAT };
        case 'RGBA32F':
            return { internalFormat: gl.RGBA32F, format: gl.RGBA, type: gl.FLOAT };
        default:
            throw new Error('Unknown texture type');
    }
};

type TextureDescription = {
    shape: number[];
    type: TextureType;
    createFramebuffer?: boolean;
}

function convertSignature(virtualSignature: TextureSignature | InputTextureSignature | RotatingTextureSignature): TextureDescription {
    return {
        shape: [virtualSignature.width, virtualSignature.height],
        type: virtualSignature.format.toUpperCase() as TextureType,
        createFramebuffer: virtualSignature.type === 'texture' || virtualSignature.type === 'rotating-texture'
    }
}

class TextureProvider {
    description: TextureDescription;
    gl: WebGL2RenderingContext;
    constructor(gl: WebGL2RenderingContext, virtualSignature: TextureSignature | InputTextureSignature | RotatingTextureSignature) {
        this.gl = gl;
        this.description = convertSignature(virtualSignature);
        this.setup();
    }

    dispose() {
        if (this.framebuffer) {
            this.gl.deleteFramebuffer(this.framebuffer);
            this.framebuffer = null;
        }
        if (this.texture) {
            this.gl.deleteTexture(this.texture);
            this.texture = null;
        }
    }

    framebuffer: WebGLFramebuffer | null = null;
    texture: WebGLTexture | null = null;
    setup() {
        const { internalFormat, format, type } = getUploadInfo(this.description.type, this.gl);
        //console.log(internalFormat, format, type)
        this.texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT, 1);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, internalFormat, this.description.shape[0], this.description.shape[1], 0, format, type, null);

        if (this.description.createFramebuffer) {
            this.framebuffer = this.gl.createFramebuffer();
            if (!this.framebuffer) {
                throw new Error('Failed to create framebuffer');
            }
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
            this.gl.framebufferTexture2D(
                this.gl.FRAMEBUFFER,
                this.gl.COLOR_ATTACHMENT0,
                this.gl.TEXTURE_2D,
                this.texture,
                0
            );
            const status = this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER);
            if (status !== this.gl.FRAMEBUFFER_COMPLETE) {
                throw new Error(`Framebuffer is not complete: ${status}`);
            }
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        }

        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    }

    setData(data: HTMLImageElement | Float32Array | Uint8Array | Array) {
        if (!this.texture) throw new Error('Texture not initialized');

        const { format, type } = getUploadInfo(this.description.type, this.gl);
        const [width, height] = this.description.shape;
        const gl = this.gl;

        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

        if (data instanceof HTMLImageElement) {
            const { internalFormat } = getUploadInfo(this.description.type, gl);
            gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, format, type, data);
        } else if (data instanceof Float32Array || data instanceof Uint8Array) {
            gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, width, height, format, type, data);
        } else {
            // if we passed a regular array, we must figure out how to interpret it based
            // on the texture format and pass on a typed array
            let typedArray: Float32Array | Uint8Array | null = null;
            if (this.description.type === 'RGBA8' || this.description.type === 'R8') {
                typedArray = new Uint8Array(data);
            } else if (this.description.type === 'R32F' || this.description.type === 'RGBA32F') {
                typedArray = new Float32Array(data);
            }
            if (typedArray) {
                gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, width, height, format, type, typedArray);
            }
        }
        gl.bindTexture(gl.TEXTURE_2D, null);
    }


}

export { convertSignature };
export default TextureProvider;