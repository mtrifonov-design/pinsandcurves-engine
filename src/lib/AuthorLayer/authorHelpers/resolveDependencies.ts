import type { FlattenedPreResourceGraph } from "../types";
import PreResource from "../PreResourceBase";
import type { RotatingTexture, Texture } from "../../Types/VirtualResources";
/**
 * At the Author stage, dependencies between resources are represented as references to live PreResource instances.
 * In the serializable Render stage, these dependencies need to be represented as string IDs.
 * This function traverses the FlattenedPreResourceGraph and replaces all PreResource references in dependency slots
 * with their corresponding string IDs, while also validating that the referenced PreResources are of the correct type.
 */
function resolveDependencies(flattenedPrg: FlattenedPreResourceGraph) {
    for (const [id, preResource] of Object.entries(flattenedPrg)) {
        preResource.setId(id);
    }
    for (const preResource of Object.values(flattenedPrg)) {
        const preResourceType = preResource.value.signature.type;
        if (preResourceType === "texture" || preResourceType === "rotating-texture") {
            const drawOps = (preResource.value as Texture | RotatingTexture).drawOps;
            for (const drawOp of drawOps) {
                const vertices = drawOp.vertices;
                if (vertices.stage !== "author" || vertices.resource.value.signature.type !== "vertices") {
                    throw new Error("DrawOp vertices must be a PreResource");
                }
                drawOp.vertices = {
                    stage: 'render',
                    resource: vertices.resource.id
                }

                const instances = drawOp.instances;
                if (instances) {
                    if (instances.stage !== "author" || instances.resource.value.signature.type !== "instances") {
                        throw new Error("DrawOp instances must be a PreResource");
                    }
                    drawOp.instances = {
                        stage: 'render',
                        resource: instances.resource.id
                    };
                }

                for (const [bindingName, uniformPreResource] of Object.entries(drawOp.uniforms)) {
                    if (uniformPreResource.stage !== "author" || uniformPreResource.resource.value.signature.type !== "uniforms") {
                        throw new Error("DrawOp uniform bindings must be PreResources");
                    }
                    drawOp.uniforms[bindingName] = {
                        stage: 'render',
                        resource: uniformPreResource.resource.id
                    };
                }

                for (const [bindingName, textureInfo] of Object.entries(drawOp.textures)) {
                    const texturePreResource = textureInfo.texture;
                    if (texturePreResource.stage !== "author" || texturePreResource.resource.value.signature.type !== "input-texture") {
                        throw new Error("DrawOp texture bindings must be PreResources");
                    }
                    textureInfo.texture = {
                        stage: 'render',
                        resource: texturePreResource.resource.id
                    };
                }
            }
        }
    }
}

export default resolveDependencies;