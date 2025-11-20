import { DrawOp, Instances, Texture, Uniforms, Vertices } from 'pinsandcurves-engine';
import vert from './vert.glsl';
import frag from './frag.glsl';
import type { GradientRendererProps } from "../blueprint";

function main({
    props,
    vertices,
    lissajousUniforms,
    displayUniforms,
} : {
    props: GradientRendererProps;
    vertices: ReturnType<typeof Vertices>;
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
            }
        },
        {
            blendMode: "alpha"
        }
    )
    const texture = Texture({
        width: props.general.canvasDimensions[0],
        height: props.general.canvasDimensions[1], 
    }, [draw], [props.general.canvasDimensions[0]]);
    return { 
        texture,
        data: {
            draw,
        }
    }
}

export default main;