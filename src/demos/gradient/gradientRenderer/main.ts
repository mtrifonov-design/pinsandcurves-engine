import { DrawOp, Texture, Uniforms } from "../../../lib/AuthorLayer";
import { Vertices } from "../../../lib/AuthorLayer";
import vert from './vert.glsl';
import frag from './frag.glsl';

const MAX_PARTICLES = 100;

function main({
    vertices,
    time,
    colorParticles,
    displayUniforms,
    lissajousParams,
} : {
    vertices: ReturnType<typeof Vertices>;
    time: number;
    colorParticles: { r: number; g: number; b: number }[];
    displayUniforms: ReturnType<typeof Uniforms>;
    lissajousParams: {
        a: [number, number];
        b: [number, number];
        c: [number, number];
    };
}) {
    const colorsTexture = Texture({
        width: MAX_PARTICLES,
        height: 1,
    }, () => {
        const data = [];
        for (let i = 0; i < MAX_PARTICLES; i++) {
            const cp = colorParticles[i] || { r: 0, g: 0, b: 0, pos: 0 };
            data.push(cp.r * 255, cp.g * 255, cp.b * 255, 255);
        }
        return data;
    }, [JSON.stringify(colorParticles)]);

    const uniforms = Uniforms({
        lissajous_a: 'vec2',
        lissajous_b: 'vec2',
        lissajous_c: 'vec2',
        numParticles: 'int',
        numMaxParticles: 'int',
        slider: 'float',
    }, () => {
        return {
            numParticles: colorParticles.length,
            numMaxParticles: MAX_PARTICLES,
            slider: [time],
            // lissajous_a: [1, 0.6],
            // lissajous_b: [1, 0.4],
            // lissajous_c: [1, 1.0],
            lissajous_a: lissajousParams.a,
            lissajous_b: lissajousParams.b,
            lissajous_c: lissajousParams.c,
            // lissajous_a: [5, 0.4],
            // lissajous_b: [3, 0.4],
            // lissajous_c: [1, 0.2],
            // lissajous_a: [1, 0.6],
            // lissajous_b: [3, 1.0],
            // lissajous_c: [1, 0.2],
        }
    }, [colorParticles.length, time, lissajousParams.a, lissajousParams.b, lissajousParams.c]);

    const draw = DrawOp(
        vertices,
        () => vert,
        () => frag,
        {
            uniforms: {
                uniforms,
                displayUniforms,
            },
            textures: {
                colors: {
                    texture: colorsTexture,
                    sampler: {
                        filter: 'nearest',
                        wrap: 'clamp',
                    }
                },
            }
        },
        {
            blendMode: "alpha"
        }
    )
    return { 
        colorsTexture,
        uniforms,
        data: {
            draw,
        }
    }
}

export default main;