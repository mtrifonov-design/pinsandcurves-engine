import { DrawOp, Texture, Uniforms } from "../../../lib/AuthorLayer";
import { Vertices } from "../../../lib/AuthorLayer";
import vert from './vert.glsl';
import frag from './frag.glsl';

const MAX_PARTICLES = 100;

function main({
    vertices,
    input,
    colorParticles,
} : {
    vertices: ReturnType<typeof Vertices>;
    input: number;
    colorParticles: { r: number; g: number; b: number, pos: number }[];
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
        console.log(data);
        return data;
    }, [JSON.stringify(colorParticles)]);

    const uniforms = Uniforms({
        numParticles: 'int',
        numMaxParticles: 'int',
        slider: 'float',
    }, () => {
        return {
            numParticles: colorParticles.length,
            numMaxParticles: MAX_PARTICLES,
            slider: [input],
        }
    }, [colorParticles.length, input]);

    const draw = DrawOp(
        vertices,
        () => vert,
        () => frag,
        {
            uniforms: {
                uniforms,
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