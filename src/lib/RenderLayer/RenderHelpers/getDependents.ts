
import type { DrawOp, VirtualResourceGraph } from "../../Types/VirtualResources";

function extractDrawOpDependencies(drawOp: DrawOp): string[] {
    const dependencies: string[] = [];
    if (drawOp.vertices.stage !== "render") throw new Error("Only render stage draw ops are supported");
    dependencies.push(drawOp.vertices.resource)
    if (drawOp.instances && drawOp.instances.stage !== "render") throw new Error("Only render stage draw ops are supported");
    if (drawOp.instances) dependencies.push(drawOp.instances.resource);
    for (const uniform of Object.values(drawOp.uniforms)) {
        if (uniform.stage !== "render") throw new Error("Only render stage draw ops are supported");
        dependencies.push(uniform.resource);
    }
    if (drawOp.textures) {
        for (const texture of Object.values(drawOp.textures)) {
            if (texture.texture.stage !== "render") throw new Error("Only render stage draw ops are supported");
            dependencies.push(texture.texture.resource);
        }
    }
    return dependencies;
}

function getDependents(resourceId: string, graph: VirtualResourceGraph): string[] {
    const dependents: string[] = [];
    for (const [resId, resource] of Object.entries(graph.resources)) {
        switch (resource.signature.type) {
            case "vertices":
            case "instances":
            case "uniforms":
            case "input-texture":
                break;
            case "rotating-texture":
            case "texture":
                for (const drawOp of resource.drawOps) {
                    const drawOpDependencies = extractDrawOpDependencies(drawOp);
                    if (drawOpDependencies.includes(resourceId)) {
                        dependents.push(resId);
                        break;
                    }
                }
                break;
            default:
                throw new Error(`Unknown resource type: ${(resource as any).signature.type}`);
        }
    }
    return dependents;
}

export default getDependents;