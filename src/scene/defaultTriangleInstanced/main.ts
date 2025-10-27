import { DrawOp, Instances, Texture, Uniforms } from "../../lib/AuthorLayer";
import Triangle from "../utils/triangle";


function defaultTriangleInstanced(input: number, selectedDemo:string) {
  const triangle = Triangle([
    { x: -0.5, y: -0.5, u: 0, v: 0  },
    { x: 0.5, y: -0.5, u: 1, v: 0  },
    { x: 0.0, y: 0.5, u: 1, v: 1  },
  ], [selectedDemo]);

  const instances = Instances({
    attributes: {
        offset: 'vec2',
      }
    },
    {
      count: 100,
      instances: () => {
        const output = [];
        for (let i = 0; i < 100; i++) {
          output.push({ offset: [Math.random() - 0.5, Math.random() - 0.5] });
        }
        return output;
      }
    }, [selectedDemo]);


  const uniforms = Uniforms({
    scale: 'float'
  }, () => ({
    scale: [input]
  }), [input, selectedDemo]);

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
            gl_Position += vec4(offset, 0.0, 0.0);
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
            instances: instances
        }
    )
  ], [selectedDemo]);
  
  return { triangle, texture, instances, uniforms };
}


export default defaultTriangleInstanced;