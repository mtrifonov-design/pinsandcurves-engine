import { DrawOp, Instances, Texture, Uniforms, Vertices } from "pinsandcurves-engine";
import defaultTriangleInstanced from "../instancing-example/blueprint";
import Quad from "../utils/quad";


function lawnMowerScene(input: {
    lawnMowerInputImage: any,
    lawnInputImage: any,
    lawnMowerPosition: { x: number, y: number },
    lawnMowerOrientation: number,
}
) {

    const quad = Quad(
        [
            { x: -1, y: -1, u: 0, v: 0 },
            { x: -1, y: 1, u: 0, v: 1 },
            { x: 1, y: 1, u: 1, v: 1 },
            { x: 1, y: -1, u: 1, v: 0 },
        ],
        []
    )
    const lawnInputTexture = Texture({
        width: 512,
        height: 512,
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
            return input.lawnInputImage;
        },
        [input.lawnMowerPosition.x, input.lawnMowerPosition.y, input.lawnMowerOrientation]);

    const lawnMowerInputTexture = Texture({
        width: 512,
        height: 512,
    },
    () => {
        return input.lawnMowerInputImage;
    },
    []);

    const grasshalmInstances = Instances({
        attributes: {
            i_position: 'vec2',
            i_angle: 'float',
            i_shadeVariation: 'float',
            i_heightVariation: 'float',
        },
        maxInstanceCount: 1000000,
    },
        {
            count: 1000000,
            instances: () => {
                const output = [];
                for (let i = 0; i < 1000000; i++) {
                    output.push({
                        i_position: [Math.random() - 0.5, Math.random() - 0.5],
                        i_angle: Math.random() - 0.5,
                        i_shadeVariation: Math.random(),
                        i_heightVariation: Math.random(),
                    });
                }
                return output;
            }
        }, []);

    const uniforms = Uniforms({
            lawnMowerPosition: 'vec2',
            lawnMowerOrientation: 'float',
    },  () => ({
        lawnMowerPosition: [input.lawnMowerPosition.x, input.lawnMowerPosition.y],
        lawnMowerOrientation: [input.lawnMowerOrientation],
    }), [
        input.lawnMowerPosition.x, input.lawnMowerPosition.y, input.lawnMowerOrientation
    ]);

    const outputTexture = Texture({
        width: 1080,
        height: 1080,
    }, [
        DrawOp(
            quad,
            () => `
            out vec2 uv;
            out float v_shadeVariation;
            flat out int v_shortGrass;
            void main() {
                uv = vec2(u, v);
                v_shortGrass = texture(src, i_position + vec2(0.5)).r > 0.5 ? 1 : 0;
                float angle = i_angle * 3.14159 * (v_shortGrass == 1 ? 0.25 : .15);
                mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
                float height = v_shortGrass == 1 ? 0.09 : 0.05;
                height = height * (0.3 + i_heightVariation * 0.7);
                vec2 finalPos = i_position + vec2(0.003, height) * uv * rotation;
                gl_Position = vec4(finalPos,i_position.y, 1.0);
                v_shadeVariation = i_shadeVariation;
            }
            `,
            () => `
            in vec2 uv;
            in float v_shadeVariation;
            flat in int v_shortGrass;
            void main() {
                outColor = vec4((0.0) + v_shadeVariation * 0.3, 
                1.0 - v_shadeVariation * (v_shortGrass == 0 ? 0.3 : 0.8), 0.0, 1.0);
            }
            `,
            {
                textures: {
                    src: {
                        texture: lawnInputTexture,
                        sampler: {
                            wrap: 'clamp',
                            filter: 'nearest',
                        }
                    },
                },
                instances: grasshalmInstances,
            },
            {
            depthTest: true,
            //blendMode: "alpha",
            }

        ),
        DrawOp(
            quad,
            () => `
            out vec2 uv;
            void main() {
                uv = vec2(u, v);
                float angle = lawnMowerOrientation - 3.14159 / 2.0;
                mat2 rotation = mat2(
                    cos(angle), -sin(angle),
                    sin(angle), cos(angle)
                );
                float scale = 0.1;
                float aspect = 1.5;
                vec2 finalPos = 
                    ((position.xy + vec2(0.,-0.5)) * vec2(1.,aspect) * rotation) * scale
                    + lawnMowerPosition + vec2(0.0,0.075);
                gl_Position = vec4(finalPos, 0., 1.0);
            }
            `,
            () => `
            in vec2 uv;
            void main() {
            vec4 lawnMowerColor = texture(src, uv);
            outColor = lawnMowerColor;
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
                uniforms: {
                    uni: uniforms,
                },
            },
            {
            blendMode: "alpha",
            }
        )
        // DrawOp(
        //     quad,
        //     () => `
        //     out vec2 uv;
        //     void main() {
        //         uv = vec2(u, v);
        //         gl_Position = vec4(position.xy, 0.0, 1.0);
        //     }
        //     `,
        //     () => `
        //     in vec2 uv;
        //     void main() {
        //         vec4 lawnColor = texture(src, uv);
        //         outColor = lawnColor;
        //     }
        //     `,
        //     {
        //         textures: {
        //             src: {
        //                 texture: lawnMowerInputTexture,
        //                 sampler: {
        //                     wrap: 'clamp',
        //                     filter: 'nearest',
        //                 }
        //             },
        //         },
        //     }
        // ),
    ], []);

    return {
        quad,
        uniforms,
        grasshalmInstances,
        outputTexture,
        lawnMowerInputTexture,
        lawnInputTexture,
    };


}

export default lawnMowerScene;