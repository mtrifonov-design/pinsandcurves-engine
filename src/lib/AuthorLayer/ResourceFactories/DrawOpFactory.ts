import type { DrawOp } from "../../Types/VirtualResources";
import type PreResource from "../PreResourceBase"


function DrawOpFactory(
    vertices: PreResource,
    vs: () => string,
    fs: () => string,
    attachments?: {
        uniforms?: { [bindingName: string]: PreResource },
        textures?: { [bindingName: string]: {
            texture: PreResource,
            sampler?: any
        } },
        instances?: PreResource
    }, 
    options?: {
        depthTest?: boolean,
    }
) {
    const att = {
        uniforms: {},
        textures: {},
        ...attachments ? attachments : {}
    }
    const val: DrawOp = {
        uniforms: Object.fromEntries(
            Object.entries(att.uniforms).map(([name, res]) => [name, {
                stage: 'author',
                resource: res
            }])
        ),
        textures: Object.fromEntries(
            Object.entries(att.textures).map(([name, val]) => [name, {
                texture: {
                    stage: 'author',
                    resource: val.texture
                },
                sampler: val.sampler
            }])
        ),
        vertices: {
            stage: 'author',
            resource: vertices
        },
        vertexShaderData: {
            stage: 'author',
            data: vs,
        },
        fragmentShaderData: {
            stage: 'author',
            data: fs
        }
    }
    if (att.instances) {
        val.instances = {
            stage: 'author',
            resource: att.instances
        }
    }
    if (options?.depthTest !== undefined) {
        val.depthTest = options.depthTest;
    }
    return val;
}




export default DrawOpFactory;