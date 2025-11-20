import { DrawOp, Instances, Texture, Uniforms, Vertices } from 'pinsandcurves-engine';
import vert from './vert.glsl';
import frag from './frag.glsl';

function main({
    vertices,
    colorsTexture,
    depthSampleTex,
    lissajousUniforms,
    displayUniforms,
} : {
    vertices: ReturnType<typeof Vertices>;
    colorsTexture: ReturnType<typeof Texture>;
    depthSampleTex: ReturnType<typeof Texture>;
    lissajousUniforms: ReturnType<typeof Uniforms>;
    displayUniforms: ReturnType<typeof Uniforms>;
}) {
    const draw = DrawOp(
        vertices,
        () => vert,
        () => frag,
        {
            uniforms: {
                lissajousUniforms,
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
                depth_src: {
                    texture: depthSampleTex,
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
        data: {
            draw,
        }
    }
}

export default main;