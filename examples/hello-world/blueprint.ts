import { DrawOp, Instances, Texture, Uniforms, Vertices } from "../../lib/src";

function helloWorld(height: number) {
    const triangle = Vertices(
        {
            attributes: {
                pos: 'vec2',
                uv: 'vec2',
            }
        }, 
        {
            triangleCount: 1,
            vertices: () => ([
                { pos: [-1,-1],      uv: [0,0] },
                { pos: [0,height],  uv: [0,1] },
                { pos: [1,-1],       uv: [1,0] }
            ]),
            indices: () => ([0, 1, 2,])
        }, 
        [height]
    );
    const outputTexture = Texture(
        {
            width: 1920,
            height: 1080,
        }, 
        [
            DrawOp(
                triangle,
                () => `
                out vec2 v_uv;
                void main() {
                    gl_Position = vec4(pos,0.,1.);
                    v_uv = uv;
                }
                `,
                () => `
                in vec2 v_uv;
                void main() {
                    outColor = vec4(v_uv, 1.0, 1.0);
                }`
            )
        ], 
        []
    );
    return { triangle, outputTexture };
}

export default helloWorld;