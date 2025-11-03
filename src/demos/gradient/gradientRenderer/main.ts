import { DrawOp, Texture, Uniforms } from "../../../lib/AuthorLayer";
import { Vertices } from "../../../lib/AuthorLayer";
import vert from './vert.glsl';
import frag from './frag.glsl';

const MAX_PARTICLES = 1000;

function main({
    vertices,
    colorParticles,
} : {
    vertices: ReturnType<typeof Vertices>;
    colorParticles: { r: number; g: number; b: number}[];
}) {
    const colorsTexture = Texture({
        width: MAX_PARTICLES,
        height: 1,
    }, () => {
        const data = [];
        for (let i = 0; i < (MAX_PARTICLES / 4); i++) {
            const color = colorParticles[i] || { r: 0, g: 0, b: 0 };
            data.push(color.r * 255);
            data.push(color.g * 255);
            data.push(color.b * 255);
            data.push(255);
        }
        return data;
    }, [JSON.stringify(colorParticles)]);

    const uniforms = Uniforms({
        numParticles: 'int',
    }, () => {
        return {
            numParticles: colorParticles.length,
        }
    }, [colorParticles.length]);

    const draw = DrawOp(
        vertices,
        vert,
        frag,
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
    return { draw }
}

export default main;