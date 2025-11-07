import type { PhysicalSignature } from "../RenderHelpers/types";
import { InstanceProvider, ProgramProvider, TextureProvider, UniformProvider, VertexProvider, type GPUResourceProvider } from "./WebGLProviders";

class GPUBackend {
    private resources: Map<string, GPUResourceProvider>;
    gl: WebGL2RenderingContext;

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
        this.resources = new Map();
    }

    getResource(
        resourceId: string,
    ) : GPUResourceProvider {
        const resource = this.resources.get(resourceId);
        if (!resource) throw new Error(`GPUBackend: getResource - resource with id ${resourceId} not found`);
        return resource;
    }

    createResource(
        signature: PhysicalSignature,
    ) : string {
        const id = crypto.randomUUID();
        switch (signature.type) {
            case 'vertices': 
                this.resources.set(id, new VertexProvider(this.gl, signature));
                break;
            case 'instances':
                this.resources.set(id, new InstanceProvider(this.gl, signature));
                break;
            case 'uniforms':
                this.resources.set(id, new UniformProvider(this.gl, signature));
                break;
            case 'program':
                this.resources.set(id, new ProgramProvider(this.gl, signature));
                break;
            case 'input-texture':
            case 'texture':
            case 'rotating-texture':
                this.resources.set(id, new TextureProvider(this.gl, signature));
                break;
            default:
                throw new Error(`GPUBackend: createResource not implemented for signature type ${signature.type}`);
        }
        return id;
    }

    releaseResource(
        resourceId: string,
    ) {
        const resource = this.resources.get(resourceId);
        if (!resource) throw new Error(`GPUBackend: releaseResource - resource with id ${resourceId} not found`);
        resource.dispose();
        this.resources.delete(resourceId);
    }
    
}

export default GPUBackend;