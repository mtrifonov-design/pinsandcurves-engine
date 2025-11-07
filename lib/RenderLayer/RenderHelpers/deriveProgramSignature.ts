import type { PhysicalProgramSignature, RenderGraphAssets } from "./types";
import type { VertexSignature, InstanceSignature, UniformSignature, VirtualResourceGraph, DrawOp } from "../../Types/VirtualResources";

function deriveProgramSignature(drawOp: DrawOp, graph: VirtualResourceGraph,
    assets: RenderGraphAssets
): PhysicalProgramSignature {
    return {
        type: 'program',
        fragmentShader: assets[drawOp.fragmentShaderData.data as string] as string,
        vertexShader: assets[drawOp.vertexShaderData.data as string] as string,
        vertexSignature: graph[drawOp.vertices.resource as string].signature as VertexSignature,
        instanceSignature: drawOp.instances ? (graph[drawOp.instances.resource as string].signature as InstanceSignature) : undefined,
        uniformSignatures: Object.fromEntries(
            Object.entries(drawOp.uniforms).map(([bindingName, slot]) => [
                bindingName,
                graph[slot.resource as string].signature as UniformSignature
            ])
        ),
        textures: Object.fromEntries(
            Object.entries(drawOp.textures).map(([textureSlot, textureInfo]) => [
                textureSlot,
                {
                    textureSignature: graph[textureInfo.texture.resource as string].signature,
                    sampler: textureInfo.sampler
                }
            ])
        )
    }
}

export default deriveProgramSignature;