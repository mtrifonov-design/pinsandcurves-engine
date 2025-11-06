import { DrawOp, Instances, Texture, Uniforms } from "../../lib/AuthorLayer";
import Quad from "../utils/quad";
import GradientRenderer from './gradientRenderer/main.ts';
import lissajousCurveRenderer from "./lissajousCurveRenderer/main.ts";
import lissajousPointsRenderer from "./lissajousPointsRenderer/main.ts";


type Props = {
  colors: { r: number; g: number; b: number }[];
  time: number;
  lissajousParams: {
    a: [number, number];
    b: [number, number];
    c: [number, number];
  };
  general: {
    canvasDimensions: [number, number];
  }
}

const defaultProps: Props = {
  colors: [
    // { r: 0.7, g: 0, b: 0 },
    // { r: 1, g: 0.5, b: 0.1 },
    // { r: 1, g: 1, b: 0.3 },

    // { r: 0.1, g: 0, b: 0 },
    // { r: 0.1, g: 0.9, b: 0.9 },
    // { r: 0, g: 0, b: 0.3 },


    // { r: 1, g: 0, b: 0 },
    // { r: 0, g: 1, b: 0 },
    // { r: 0, g: 0, b: 1 },

    { r: 1, g: 1, b: 0 },
    { r: 0, g: 1, b: 1 },
    { r: 1, g: 0, b: 1 },
  ],
  time: 0,
  lissajousParams: {
    a: [1, 0.6],
    b: [2, 0.4],
    c: [1, 1.0],

    // a: [5, 0.4],
    // b: [3, 0.4],
    // c: [1, 0.2],

    // a: [1, 0.6],
    // b: [3, 1.0],
    // c: [1, 0.2],

    // a: [1, 0.6],
    // b: [1, 0.4],
    // c: [1, 1.0],
  },
  general: {
    canvasDimensions: [800, 600],
  }
}



function main(props: Props) {
  const fullscreenQuad = Quad([
    { x: -1, y: -1, u: 0, v: 0 },
    { x: 1, y: -1, u: 1, v: 0 },
    { x: 1, y: 1, u: 1, v: 1 },
    { x: -1, y: 1, u: 0, v: 1 },
  ], []);
  const displayUniforms = Uniforms({
    resolution: 'vec2',
  }, () => ({
    resolution: [props.general.canvasDimensions[0], props.general.canvasDimensions[1]],
  }), [props.general.canvasDimensions[0],props.general.canvasDimensions[1]]);
  const gradientRenderer = GradientRenderer({
    vertices: fullscreenQuad,
    time: props.time,
    colorParticles: props.colors,
    displayUniforms,
    lissajousParams: props.lissajousParams,
  });

  const curve = lissajousCurveRenderer({
    quad: fullscreenQuad,
    time: props.time,
    colorsTexture: gradientRenderer.colorsTexture,
    colorUniforms: gradientRenderer.uniforms,
    displayUniforms,
  })
  const points = lissajousPointsRenderer({
    quad: fullscreenQuad,
    time: props.time,
    numberOfColors: props.colors.length,
    colorsTexture: gradientRenderer.colorsTexture,
    colorUniforms: gradientRenderer.uniforms,
    displayUniforms,
  })

  const outputTexture = Texture({
    width: props.general.canvasDimensions[0],
    height: props.general.canvasDimensions[1],
  }, [
    gradientRenderer.data.draw,
    curve.data.draw,
    points.data.draw,
  ], [props.general.canvasDimensions[0], props.general.canvasDimensions[1]]);
  return {
    fullscreenQuad,
    gradientRenderer,
    outputTexture,
    curve,
    points,
    displayUniforms,
  }
}


function main2(input: number, selectedDemo: string) {
  const props = { ...defaultProps, time: input };
  const scene = main(props);
  return scene;
}

export default main2;