import { DrawOp, Instances, Texture, Uniforms, Vertices } from "pinsandcurves-engine";
import defaultTriangleInstanced from "../instancing-example/blueprint";
import Quad from "../utils/quad";


function defaultTriangleInstancedUsedAsTexture(input: number) {

    const dti = defaultTriangleInstanced(input);
    const quad = Quad(
        [
            { x: -1, y: -1, u: 0, v: 0 },
            { x: -1, y: 1, u: 0, v: 1 },
            { x: 1, y: 1, u: 1, v: 1 },
            { x: 1, y: -1, u: 1, v: 0 },
        ],
        []
    )
    const outputTexture = Texture({
        width: 1920,
        height: 1080,
    }, [
        DrawOp(
            quad,
            () =>`
            out vec2 uv;
            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
                uv = vec2(u, v);
            }
            `,
            () => `
            in vec2 uv;
            void main() {
                float gridSize = 8.;
                vec2 localUv = fract(uv * gridSize);
                vec4 texColor = texture(src, localUv);
                outColor = texColor;
            }
            `,
            {
                textures: {
                    src: {
                        texture: dti.outputTexture,
                        sampler: {
                            wrap: 'clamp-to-edge',
                            filter: 'linear',
                        }
                    }
                }
            }

        )
    ], []);

    return {
        quad,
        outputTexture,
        dti
    };


}

export default defaultTriangleInstancedUsedAsTexture;