import { DrawOp, Instances, Texture, Uniforms } from "../../lib/AuthorLayer";
import Quad from "../utils/quad";
import GradientRenderer from './gradientRenderer/main.ts';
import lissajousCurveRenderer from "./lissajousCurveRenderer/main.ts";
import lissajousPointsRenderer from "./lissajousPointsRenderer/main.ts";

const colorParticles = [
      // { r: 0.7, g: 0, b: 0 },
      // { r: 1, g: 0.5, b: 0.1 },
      // { r: 1, g: 1, b: 0.3 },

      // { r: 0.1, g: 0, b: 0 },
      // { r: 0.1, g: 0.9, b: 0.9 },
      // { r: 0, g: 0, b: 0.3 },


      { r: 1, g: 0, b: 0 },
      { r: 0, g: 1, b: 0 },
      { r: 0, g: 0, b: 1 },

      // { r: 1, g: 1, b: 0 },
      // { r: 0, g: 1, b: 0 },
      // { r: 0, g: 1, b: 1 },
      // { r: 0, g: 0, b: 1 },
      // { r: 1, g: 0, b: 1 },
    ]


function main(input: number, selectedDemo:string) {
  const fullscreenQuad = Quad([
    { x: -1,  y: -1,  u: 0,   v: 0  },
    { x: 1,   y: -1,  u: 1,   v: 0  },
    { x: 1,   y: 1,   u: 1,   v: 1  },
    { x: -1,  y: 1,   u: 0,   v: 1  },
  ], [selectedDemo]);
  const displayUniforms = Uniforms({
    resolution: 'vec2',
  }, () => ({
    resolution: [800, 600],
  }), []);
  const gradientRenderer = GradientRenderer({
    vertices: fullscreenQuad,
    input,
    colorParticles, 
    displayUniforms,
  });

  const curve = lissajousCurveRenderer({
    quad: fullscreenQuad,
    input,
    colorsTexture: gradientRenderer.colorsTexture,
    colorUniforms: gradientRenderer.uniforms,
    displayUniforms,
  })
  const points = lissajousPointsRenderer({
    quad: fullscreenQuad,
    input,
    numberOfColors: colorParticles.length,
    colorsTexture: gradientRenderer.colorsTexture,
    colorUniforms: gradientRenderer.uniforms,
    displayUniforms,
  })

  const outputTexture = Texture({
    width: 800,
    height: 600,
  }, [
    gradientRenderer.data.draw,
    curve.data.draw,
    points.data.draw,
    // drawFigure,
    // drawCircles,
  ], [selectedDemo]);
  return {
    fullscreenQuad,
    gradientRenderer,
    outputTexture,
    curve,
    points,
    displayUniforms,
  }
}


export default main;