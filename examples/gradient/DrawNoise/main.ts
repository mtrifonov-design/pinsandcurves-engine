import { DrawOp } from 'pinsandcurves-engine';
import vert from './vert.glsl';
import frag from './frag.glsl';


function drawNoise({
    quad,
    texture,
    lissajousUniforms,
    displayUniforms,
}) {
    const draw = DrawOp(
        quad,
        () => vert,
        () => frag,
        {
            uniforms: {
                lissajousUniforms,
                displayUniforms,
            },
            textures: {
                src: {
                    sampler: {
                        edge: 'clamp',
                        filter: 'linear',
                    },
                    texture: texture,
                }
            }
        },
    )

    return {
        data: {
            draw,
        }
    }
}

export default drawNoise;