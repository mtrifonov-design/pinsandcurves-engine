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
    input,
    colorParticles: [
      // { r: 0.7, g: 0, b: 0 },
      // { r: 1, g: 0.5, b: 0.1 },
      // { r: 1, g: 1, b: 0.3 },

      { r: 0.1, g: 0, b: 0 },
      { r: 0.1, g: 0.9, b: 0.9 },
      { r: 0, g: 0, b: 0.3 },
      { r: 0, g: 0, b: 0.3 },
      { r: 0.1, g: 0.9, b: 0.9 },

      // { r: 1, g: 0, b: 0 },
      // { r: 0, g: 1, b: 0 },
      // { r: 0, g: 0, b: 1 },

      // { r: 1, g: 1, b: 0 },
      // { r: 0, g: 1, b: 0 },
      // { r: 0, g: 1, b: 1 },
      // { r: 0, g: 0, b: 1 },
      // { r: 1, g: 0, b: 1 },
    ]
  });
  const drawFigure = "figure";
  const drawCircles = "circles";
  const outputTexture = Texture({
    width: 1920,
    height: 1080,
  }, [
    gradientRenderer.data.draw,
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