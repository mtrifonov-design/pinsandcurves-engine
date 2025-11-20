import { DrawOp, Instances, Texture, Uniforms } from 'pinsandcurves-engine';
import DrawGradient from './DrawGradient/main.ts';
import DrawLissajousCurve from "./DrawLissajousCurve/main.ts";
import DrawPoints from "./DrawPoints/main.ts";
import sharedInputs from "./sharedInputs/main.ts";
import SampleDepthTexture from "./SampleDepthTexture/main.ts";
import copyTexture from '../utils/copyTexture.ts';
import DrawNoise from './DrawNoise/main.ts';

type GradientRendererProps = {
  colors: { r: number; g: number; b: number }[];
  time: number;
  lissajousParams: {
    a: [number, number];
    b: [number, number];
    c: [number, number];
  };
  mixingIntensity: number;
  noiseIntensity: number;
  enableNoise: boolean;
  xyRotation: [number, number];
  general: {
    canvasDimensions: [number, number];
    showLissajousFigure: boolean;
  }
}

const defaultProps: GradientRendererProps = {
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

    // { r: 1, g: 1, b: 0 },
    // { r: 0, g: 1, b: 1 },
    // { r: 1, g: 0, b: 1 },

    { r: Math.pow(24 / 255, 1.5), g: Math.pow(0, 1.5), b: Math.pow(97 / 255, 1.5) },
    { r: Math.pow(79 / 255, 1.5), g: Math.pow(23 / 255, 1.5), b: Math.pow(135 / 255, 1.5) },
    { r: Math.pow(235 / 255, 1.5), g: Math.pow(52 / 255, 1.5), b: Math.pow(120 / 255, 1.5) },
    { r: Math.pow(235 / 255, 1.5), g: Math.pow(119 / 255, 1.5), b: Math.pow(60 / 255, 1.5) },
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
  mixingIntensity: 0.5,
  xyRotation: [0.0, 0.0],
  noiseIntensity: 0.2,
  enableNoise: true,
  general: {
    canvasDimensions: [800, 600],
    showLissajousFigure: true,

  }
}



function main(props: GradientRendererProps) {


  const shared_inputs = sharedInputs(props);

  const sampleDepthTex = SampleDepthTexture({
    props,
    vertices: shared_inputs.quad,
    displayUniforms: shared_inputs.display_uniforms,
    lissajousUniforms: shared_inputs.lissajous_uniforms,
  });


  const drawGradient = DrawGradient({
    vertices: shared_inputs.quad,
    colorsTexture: shared_inputs.colors_texture,
    displayUniforms: shared_inputs.display_uniforms,
    lissajousUniforms: shared_inputs.lissajous_uniforms,
    depthSampleTex: sampleDepthTex.texture,
  });

  const drawLissajousCurve = DrawLissajousCurve({
    props,
    quad: shared_inputs.quad,
    lissajousUniforms: shared_inputs.lissajous_uniforms,
    displayUniforms: shared_inputs.display_uniforms,
  })
  const drawPoints = DrawPoints({
    props,
    quad: shared_inputs.quad,
    numberOfColors: props.colors.length,
    colorsTexture: shared_inputs.colors_texture,
    lissajousUniforms: shared_inputs.lissajous_uniforms,
    displayUniforms: shared_inputs.display_uniforms,
  })

  const gradientTexture = Texture({
    width: props.general.canvasDimensions[0],
    height: props.general.canvasDimensions[1],
  }, [
    drawGradient.data.draw,
  ], [props.general.canvasDimensions[0], props.general.canvasDimensions[1]]);

  const drawNoise = DrawNoise({
    quad: shared_inputs.quad,
    texture: gradientTexture,
    lissajousUniforms: shared_inputs.lissajous_uniforms,
    displayUniforms: shared_inputs.display_uniforms,
  })

  const renderTexture = Texture({
    width: props.general.canvasDimensions[0],
    height: props.general.canvasDimensions[1],
  }, [
    drawNoise.data.draw,
  ], [props.general.canvasDimensions[0], props.general.canvasDimensions[1]]);

  const outputTexture = Texture({
    width: props.general.canvasDimensions[0],
    height: props.general.canvasDimensions[1],
  }, props.general.showLissajousFigure ? [
    copyTexture(shared_inputs.quad, renderTexture),
    drawLissajousCurve.data.draw,
    drawPoints.data.draw,
  ] : [
    copyTexture(shared_inputs.quad, renderTexture)
  ], [props.general.canvasDimensions[0], props.general.canvasDimensions[1], props.general.showLissajousFigure]);
  return {
    //outputTexture,
    shared_inputs,
    drawGradient,
    drawLissajousCurve,
    drawPoints,
    sampleDepthTex,
    outputTexture,
    renderTexture,
    gradientTexture,

    //outputTexture: sampleDepthTex.texture,
  }
}


function main2(input: number) {
  const props = { ...defaultProps, time: input };
  const scene = main(props);
  return scene;
}

export { defaultProps };

export type { GradientRendererProps };

export default main2;