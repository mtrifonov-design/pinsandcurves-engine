import { DrawOp, Instances, Texture, Uniforms, Vertices } from "pinsandcurves-engine";

function Quad(
    vertices: { x: number, y: number, [key: string]: any }[],
    deps: any[] = []
) {
    const attrKeys = Object.keys(vertices[0]).filter(k => k !== 'x' && k !== 'y');
    return Vertices({
        attributes: {
            position: 'vec2',
            ...Object.fromEntries(attrKeys.map(k => [k, 'float']))
        }
    }, {
        triangleCount: 2,
        vertices: () => ([
            { position: [vertices[0].x, vertices[0].y],
                ...Object.fromEntries(attrKeys.map(k => [k, vertices[0][k]])) },
            { position: [vertices[1].x, vertices[1].y],
                ...Object.fromEntries(attrKeys.map(k => [k, vertices[1][k]])) },
            { position: [vertices[2].x, vertices[2].y],
                ...Object.fromEntries(attrKeys.map(k => [k, vertices[2][k]])) },
            { position: [vertices[3].x, vertices[3].y],
                ...Object.fromEntries(attrKeys.map(k => [k, vertices[3][k]])) },
        ]),
        indices: () => ([
            0, 1, 2,
            0, 2, 3
        ])
    }, deps);

}

export default Quad;