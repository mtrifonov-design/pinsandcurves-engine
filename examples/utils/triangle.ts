import { DrawOp, Instances, Texture, Uniforms, Vertices } from "../../lib/src";

function Triangle(
    vertices: { x: number, y: number, [key: string]: any }[],
    deps: any[] = []
) {
    const attrKeys = Object.keys(vertices[0]).filter(k => k !== 'x' && k !== 'y');
    return Vertices({
        attributes: {
            position: 'vec4',
            ...Object.fromEntries(attrKeys.map(k => [k, 'float']))
        }
    }, {
        triangleCount: 1,
        vertices: () => ([
            { position: [vertices[0].x, vertices[0].y, 0, 1],
                ...Object.fromEntries(attrKeys.map(k => [k, vertices[0][k]])) },
            { position: [vertices[1].x, vertices[1].y, 0, 1],
                ...Object.fromEntries(attrKeys.map(k => [k, vertices[1][k]])) },
            { position: [vertices[2].x, vertices[2].y, 0, 1],
                ...Object.fromEntries(attrKeys.map(k => [k, vertices[2][k]])) }
        ]),
        indices: () => ([
            0, 1, 2,
        ])
    }, deps);

}

export default Triangle;