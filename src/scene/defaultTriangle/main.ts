import { DrawOp, Texture, Uniforms } from "../../lib/AuthorLayer";
import Triangle from "../utils/triangle";


function defaultTriangle(input: number, selectedDemo:string) {
  const triangle = Triangle([
    { x: -0.5, y: -0.5, u: 0, v: 0  },
    { x: 0.5, y: -0.5, u: 1, v: 0  },
    { x: 0.0, y: 0.5, u: 1, v: 1  },
  ], [selectedDemo]);
  
  const uniforms = Uniforms({
    scale: 'float'
  }, () => ({
    scale: [input]
  }), [input,selectedDemo]);

  const texture = Texture({
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
            }
        }
    )
  ], [selectedDemo]);
  return { triangle, texture, uniforms };
}


export default defaultTriangle;