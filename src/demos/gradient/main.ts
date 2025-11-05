import { DrawOp, Instances, Texture, Uniforms } from "../../lib/AuthorLayer";
import Quad from "../utils/quad";
import GradientRenderer from './gradientRenderer/main.ts';
import lissajousCurveRenderer from "./lissajousCurveRenderer/main.ts";


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

      // { r: 0.1, g: 0, b: 0 },
      // { r: 0.1, g: 0.9, b: 0.9 },
      // { r: 0, g: 0, b: 0.3 },
      // { r: 0, g: 0, b: 0.3 },
      // { r: 0.1, g: 0.9, b: 0.9 },

      { r: 1, g: 0, b: 0, pos: 0 },
      { r: 0, g: 1, b: 0, pos: 0.7 },
      { r: 0, g: 0, b: 1, pos: 0.9 },

      // { r: 1, g: 1, b: 0 },
      // { r: 0, g: 1, b: 0 },
      // { r: 0, g: 1, b: 1 },
      // { r: 0, g: 0, b: 1 },
      // { r: 1, g: 0, b: 1 },
    ]
  });
  const curve = lissajousCurveRenderer({
    quad: fullscreenQuad,
    input,
    colorsTexture: gradientRenderer.colorsTexture,
    colorUniforms: gradientRenderer.uniforms,
  })

  const outputTexture = Texture({
    width: 1920,
    height: 1080,
  }, [
    gradientRenderer.data.draw,
    curve.data.draw,
    // drawFigure,
    // drawCircles,
  ], [selectedDemo]);
  return {
    fullscreenQuad,
    gradientRenderer,
    outputTexture,
    curve
  }
}


export default main;