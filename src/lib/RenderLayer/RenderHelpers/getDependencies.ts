
import type { DrawOp, VirtualResourceGraph } from "../../Types/VirtualResources";

function getDependencies(resourceId: string, graph: VirtualResourceGraph): string[] {
    const resource = graph[resourceId];
    if (!resource) throw new Error(`Resource ${resourceId} not found in graph`);
    const resourceType = resource.signature.type;
    switch (resourceType) {
        case "vertices":
        case "instances":
        case "uniforms":
        case "input-texture":
            return [];
        case "rotating-texture":
        case "texture":
            const dependencies: string[] = [];
            for (const drawOp of resource.drawOps as DrawOp[]) {
                if (drawOp.vertices.stage !== "render") throw new Error("Only render stage draw ops are supported");
                dependencies.push(drawOp.vertices.resource);
                if (drawOp.instances) {
                    if (drawOp.instances.stage !== "render") throw new Error("Only render stage draw ops are supported");
                    dependencies.push(drawOp.instances.resource);
                }
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
            }
            return dependencies;
        default:
            throw new Error(`Unknown resource type: ${(resource as any).signature.type}`);
    }
}

export default getDependencies;