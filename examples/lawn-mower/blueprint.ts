import { DrawOp, Instances, Texture, Uniforms, Vertices } from "pinsandcurves-engine";
import defaultTriangleInstanced from "../instancing-example/blueprint";
import Quad from "../utils/quad";


function lawnMowerScene(input: {
    lawnMowerInputImage: any,
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
    const lawnMowerInputTexture = Texture({
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
            return input.lawnMowerInputImage;
        },
        [input.lawnMowerPosition.x, input.lawnMowerPosition.y, input.lawnMowerOrientation]);


    const grasshalmInstances = Instances({
        attributes: {
            i_position: 'vec2',
            i_angle: 'float',
            i_shadeVariation: 'float',
        },
        maxInstanceCount: 100000,
    },
        {
            count: 100000,
            instances: () => {
                const output = [];
                for (let i = 0; i < 100000; i++) {
                    output.push({
                        i_position: [Math.random() - 0.5, Math.random() - 0.5],
                        i_angle: Math.random() - 0.5,
                        i_shadeVariation: Math.random() 
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
            flat out int v_shortGrass;
            void main() {
                uv = vec2(u, v);
                v_shortGrass = texture(src, i_position + vec2(0.5)).r > 0.5 ? 1 : 0;
                float angle = i_angle * 3.14159 * (v_shortGrass == 1 ? 0.25 : .1);
                mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
                float height = v_shortGrass == 1 ? 0.1 : 0.05;
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
                1.0 - v_shadeVariation * (v_shortGrass == 0 ? 0.2 : 0.4), 0.0, 1.0);
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
                instances: grasshalmInstances,
            }

        ),
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
        grasshalmInstances,
        outputTexture,
        lawnMowerInputTexture
    };


}

export default lawnMowerScene;