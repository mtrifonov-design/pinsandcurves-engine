import { DrawOp, Instances, Texture, Uniforms, Vertices } from "pinsandcurves-engine";
import Triangle from "../utils/triangle";


function defaultTriangleUniforms(input: number) {
  const triangle = Triangle([
    { x: -0.5, y: -0.5, u: 0, v: 0  },
    { x: 0.5, y: -0.5, u: 1, v: 0  },
    { x: 0.0, y: 0.5, u: 1, v: 1  },
  ], []);

  const uniforms = Uniforms({
    scale: 'float'
  }, () => ({
    scale: [input]
  }), [input]);

  const outputTexture = Texture({
    width: 1920,
    height: 1080,
  }, [
    DrawOp(
        triangle,
        () => `
        out vec2 uv;
        void main() {
            gl_Position = position * vec4(vec3(scale),1.);
            uv = vec2(u, v);
        }
        `,
        () => `
        in vec2 uv;
        void main() {
            outColor = vec4(uv, 1.0, 1.0);
        }`,
        {
            uniforms: {
                uni: uniforms,
            },
        }
    )
  ], []);
  
  return { triangle, outputTexture, uniforms };
}


export default defaultTriangleUniforms;