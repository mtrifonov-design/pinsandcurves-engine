import { DrawOp, Texture, Uniforms } from "../../lib/AuthorLayer";
import Quad from "../utils/quad";
import GradientRenderer from './gradientRenderer/main.ts';


function main(input: number, selectedDemo:string) {
  const fullscreenQuad = Quad([
    { x: -1,  y: -1,  u: 0,   v: 0  },
    { x: 1,   y: -1,  u: 1,   v: 0  },
    { x: 1,   y: 1,   u: 1,   v: 1  },
    { x: -1,  y: 1,   u: 0,   v: 1  },
  ], [selectedDemo]);
  const gradientRenderer = GradientRenderer({
    vertices: fullscreenQuad,
  });
  const drawFigure = "figure";
  const drawCircles = "circles";
  const outputTexture = Texture({
    width: 1920,
    height: 1080,
  }, [
    gradientRenderer.draw,
    // drawFigure,
    // drawCircles,
  ], [selectedDemo]);
  return {
    fullscreenQuad,
    gradientRenderer,
    outputTexture
  }



  // const triangle = Triangle([
  //   { x: -0.5, y: -0.5, u: 0, v: 0  },
  //   { x: 0.5, y: -0.5, u: 1, v: 0  },
  //   { x: 0.0, y: 0.5, u: 1, v: 1  },
  // ], [selectedDemo]);
  
  // const uniforms = Uniforms({
  //   scale: 'float'
  // }, () => ({
  //   scale: [input]
  // }), [input,selectedDemo]);

  // const outputTexture = Texture({
  //   width: 1920,
  //   height: 1080,
  // }, [
  //   DrawOp(
  //       triangle,
  //       () => `
  //       out vec2 uv;
  //       void main() {
  //           gl_Position = position * vec4(vec3(scale),1.);
  //           uv = vec2(u, v);
  //       }
  //       `,
  //       () => `
  //       in vec2 uv;
  //       void main() {
  //           outColor = vec4(uv, 1.0, 1.0);
  //       }`,
  //       {
  //           uniforms: {
  //               uni: uniforms,
  //           }
  //       }
  //   )
  // ], [selectedDemo]);
  // return { triangle, outputTexture, uniforms };
}


export default main;