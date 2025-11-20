import type { GradientRendererProps } from "../blueprint";
import { DrawOp, Instances, Texture, Uniforms, Vertices } from 'pinsandcurves-engine';
import Quad from "../../utils/quad";

const MAX_PARTICLES = 100;

function main(props: GradientRendererProps) {
    const display_uniforms = Uniforms({
        resolution: 'vec2',
    }, () => ({
        resolution: [props.general.canvasDimensions[0], props.general.canvasDimensions[1]],
    }), [props.general.canvasDimensions[0], props.general.canvasDimensions[1]]);

    const lissajous_uniforms = Uniforms({
        lissajous_a: 'vec2',
        lissajous_b: 'vec2',
        lissajous_c: 'vec2',
        xyRotation: 'vec2',
        numParticles: 'int',
        numMaxParticles: 'int',
        time: 'float',
        mixingIntensity: 'float',
        noiseIntensity: 'float',
    }, () => {
        return {
            numParticles: props.colors.length,
            numMaxParticles: MAX_PARTICLES,
            time: [props.time],
            lissajous_a: props.lissajousParams.a,
            lissajous_b: props.lissajousParams.b,
            lissajous_c: props.lissajousParams.c,
            mixingIntensity: props.mixingIntensity,
            xyRotation: props.xyRotation,
            noiseIntensity: props.noiseIntensity,
        }
    }, [props.colors.length, props.time, props.lissajousParams.a, props.lissajousParams.b, props.lissajousParams.c]);

    const colors_texture = Texture({
        width: MAX_PARTICLES,
        height: 1,
    }, () => {
        const data = [];
        for (let i = 0; i < MAX_PARTICLES; i++) {
            const cp = props.colors[i] || { r: 0, g: 0, b: 0, pos: 0 };
            data.push(cp.r * 255, cp.g * 255, cp.b * 255, 255);
        }
        return data;
    }, [JSON.stringify(props.colors)]);

    const quad = Quad([
        { x: -1, y: -1, u: 0, v: 0 },
        { x: 1, y: -1, u: 1, v: 0 },
        { x: 1, y: 1, u: 1, v: 1 },
        { x: -1, y: 1, u: 0, v: 1 },
    ], []);

    return {
        display_uniforms,
        lissajous_uniforms,
        colors_texture,
        quad
    };
}
export default main;