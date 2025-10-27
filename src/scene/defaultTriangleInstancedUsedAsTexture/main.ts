import { DrawOp, Texture } from "../../lib/AuthorLayer";
import defaultTriangleInstanced from "../defaultTriangleInstanced/main";
import Quad from "../utils/quad";


function defaultTriangleInstancedUsedAsTexture(input: number, selectedDemo:string) {

    const dti = defaultTriangleInstanced(input, selectedDemo);
    const quad = Quad(
        [
            { x: -1, y: -1, u: 0, v: 0 },
            { x: -1, y: 1, u: 0, v: 1 },
            { x: 1, y: 1, u: 1, v: 1 },
            { x: 1, y: -1, u: 1, v: 0 },
        ],
        [selectedDemo]
    )
    const texture = Texture({
        width: 1920,
        height: 1080,
    }, [
        DrawOp(
            quad,
            () =>`
            out vec2 uv;
            void main() {
                gl_Position = position;
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
                //outColor = vec4(localUv, 1.0,1.0);
            }
            `,
            {
                textures: {
                    src: {
                        texture: dti.texture,
                        sampler: {
                            wrap: 'clamp-to-edge',
                            filter: 'linear',
                        }
                    }
                }
            }

        )
    ], [selectedDemo]);

    return {
        quad,
        texture,
        dti
    };


}

export default defaultTriangleInstancedUsedAsTexture;