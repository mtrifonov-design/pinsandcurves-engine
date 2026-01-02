import { DrawOp, Instances, Texture, Uniforms, Vertices } from "pinsandcurves-engine";
import defaultTriangleInstanced from "../instancing-example/blueprint";
import Quad from "../utils/quad";

function generateLawnMowerDistanceTexture(inputTexture: Texture, quad: Vertices) {
    const fragment = {};
    const numberOfIterations = 10;
    fragment['startTexture'] = Texture({
        width: 512,
        height: 512,
        type: 'rgba32f',
    }, [
        DrawOp(
            quad,
            () => `
            out vec2 uv;
            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
                uv = vec2(u, v);
            }
            `,
            () => `

            in vec2 uv;
            void main() {
                float texPx = texture(src, uv).r;
                vec2 objPos = vec2(1./0.);
                bool invert = false;

                if (invert) {
                    if (texPx < 0.5) {
                        objPos = uv;
                    }
                }
                if (!invert) {
                    if (texPx > 0.5) {
                        objPos = uv;
                    }
                }
                outColor = vec4(objPos, 0., 1.);
            }`,
    ]);


    for (let i = 0; i < numberOfIterations; i++) {
        fragment[`iteration${i}`] = Texture({
            width: 512,
            height: 512,
            type: 'rgba32f',
        }, [
            DrawOp(
                quad,
                () => `
                out vec2 uv;
                void main() {
                    gl_Position = vec4(position, 0.0, 1.0);
                    uv = vec2(u, v);
                }
                `,
                () => `
                in vec2 uv;
                bool outOfBounds(vec2 coord) {
                    return coord.x < 0. || coord.x > 1. || coord.y < 0. || coord.y > 1.;
                }

                void main() {
                    float stepSize = pow(2., float(10. - passNum)); 
                    float relStep = stepSize / 512.;


                    vec2 topLeft = texture(src, uv + vec2(-relStep, -relStep)).rg;
                    if (outOfBounds(uv + vec2(-relStep, -relStep))) topLeft = vec2(1./0.);
                    vec2 topCenter = texture(src, uv + vec2(0., -relStep)).rg;
                    if (outOfBounds(uv + vec2(0., -relStep))) topCenter = vec2(1./0.);
                    vec2 topRight = texture(src, uv + vec2(relStep, -relStep)).rg;
                    if (outOfBounds(uv + vec2(relStep, -relStep))) topRight = vec2(1./0.);
                    vec2 midLeft = texture(src, uv + vec2(-relStep, 0.)).rg;
                    if (outOfBounds(uv + vec2(-relStep, 0.))) midLeft = vec2(1./0.);
                    vec2 midRight = texture(src, uv + vec2(relStep, 0.)).rg;
                    if (outOfBounds(uv + vec2(relStep, 0.))) midRight = vec2(1./0.);
                    vec2 botLeft = texture(src, uv + vec2(-relStep, relStep)).rg;
                    if (outOfBounds(uv + vec2(-relStep, relStep))) botLeft = vec2(1./0.);
                    vec2 botCenter = texture(src, uv + vec2(0., relStep)).rg;
                    if (outOfBounds(uv + vec2(0., relStep))) botCenter = vec2(1./0.);
                    vec2 botRight = texture(src, uv + vec2(relStep, relStep)).rg;
                    if (outOfBounds(uv + vec2(relStep, relStep))) botRight = vec2(1./0.);

                    float posInf = 1.0 / 0.0;
                    vec2 winner = vec2(posInf, posInf);
                    if (length(topLeft - uv) < length(winner - uv)) winner = topLeft;
                    if (length(topCenter - uv) < length(winner - uv)) winner = topCenter;
                    if (length(topRight - uv) < length(winner - uv)) winner = topRight;
                    if (length(midLeft - uv) < length(winner - uv)) winner = midLeft;
                    if (length(midRight - uv) < length(winner - uv)) winner = midRight;
                    if (length(botLeft - uv) < length(winner - uv)) winner = botLeft;
                    if (length(botCenter - uv) < length(winner - uv )) winner = botCenter;
                    if (length(botRight - uv) < length(winner- uv)) winner = botRight;
                    outColor = vec4(winner, 0., 1.);
                }`,
                {
                    textures: {
                        src: {
                            texture: i === 0 ? inputTexture : fragment[`iteration${i - 1}`],
                            sampler: {
                                wrap: 'clamp',
                                filter: 'nearest',
                            }
                        }
                    }
                }
            )
        ], [])
    };
    fragment[`outputTexture`] = Texture({
        width: 512,
        height: 512,
        type: 'rgba32f',
    }, [
        DrawOp(
            quad,
            () => `
            out vec2 uv;
            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
                uv = vec2(u, v);
            }
            `,
            () => `
                        in vec2 uv;
            void main() {
                vec2 texPx = texture(src, uv).rg;
                vec2 invTexPx = texture(srcInv, uv).rg;
                float l1 = length(texPx - uv);
                float l2 = length(invTexPx - uv);
                float dist = (l1-l2) - 100.;
                vec2 normal = normalize((texPx - uv) - (invTexPx - uv));
                outColor = vec4(dist, normal, 1.);
            }`,
        ),
    ], []);

    return fragment;
};

function defaultTriangleInstancedUsedAsTexture(input: number) {

    const quad = Quad(
        [
            { x: -1, y: -1, u: 0, v: 0 },
            { x: -1, y: 1, u: 0, v: 1 },
            { x: 1, y: 1, u: 1, v: 1 },
            { x: 1, y: -1, u: 1, v: 0 },
        ],
        []
    )
    const lawnMowerInputTexture = Texture({
        width: 512,
        height: 512,
        format: 'rgba32f',
    },
        () => {
            const size = 512;
            const data = [];
            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    if (x > size / 2 && y > size / 2) {
                        data.push(255, 255, 255, 255);
                        continue;
                    }
                    data.push(0, 0, 0, 255);
                }
            }
            return data;
        },
        []);

    const lawnMowerDistanceTexture = generateLawnMowerDistanceTexture(
        lawnMowerInputTexture,
        quad
    );



    const grasshalmInstances = Instances({
        attributes: {
            i_position: 'vec2',
            i_angle: 'float',
            i_shadeVariation: 'float',
        },
    },
        {
            count: 1000,
            instances: () => {
                const output = [];
                for (let i = 0; i < 1000; i++) {
                    output.push({
                        i_position: [Math.random() - 0.5, Math.random() - 0.5],
                        i_angle: Math.random() - 0.5,
                        i_shadeVariation: Math.random() - 0.5
                    });
                }
                return output;
            }
        }, []);

    const outputTexture = Texture({
        width: 1080,
        height: 1080,
    }, [
        DrawOp(
            quad,
            () => `
            out vec2 uv;
            out float v_shadeVariation;
            void main() {
                uv = vec2(u, v);
                float angle = i_angle * 3.14159 * 0.2;
                mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
                vec2 finalPos = i_position + vec2(0.005, 0.1) * uv * rotation;
                gl_Position = vec4(finalPos, 0.0, 1.0);
                v_shadeVariation = i_shadeVariation;
            }
            `,
            () => `
            in vec2 uv;
            in float v_shadeVariation;
            void main() {
                outColor = vec4(0.0, 1.0 - v_shadeVariation, 0.0, 1.0);
            }
            `,
            {
                textures: {
                },
                instances: grasshalmInstances,
            }

        ),
        DrawOp(
            quad,
            () => `
            out vec2 uv;
            void main() {
                uv = vec2(u, v);
                gl_Position = vec4(position.xy, 0.0, 1.0);
            }
            `,
            () => `
            in vec2 uv;
            void main() {
                vec4 lawnColor = texture(src, uv);
                outColor = lawnColor;
            }
            `,
            {
                textures: {
                    src: {
                        texture: lawnMowerInputTexture,
                        sampler: {
                            wrap: 'clamp',
                            filter: 'nearest',
                        }
                    },
                },
            }
        ),
    ], []);

    return {
        quad,
        grasshalmInstances,
        outputTexture,
        lawnMowerInputTexture
    };


}

export default defaultTriangleInstancedUsedAsTexture;