import type { ResourceTypes } from 'pinsandcurves-engine';
type Vertices = ResourceTypes.Vertices;
import { DrawOp, Instances, Texture, Uniforms } from 'pinsandcurves-engine';
import vert from './vert.glsl';
import frag from './frag.glsl';
import type { GradientRendererProps } from "../blueprint";


const MAX_PARTICLES = 500;

function lissajousPointsRenderer({
    props,
    quad,
    numberOfColors,
    colorsTexture,
    lissajousUniforms,
    displayUniforms,
} : {
    props: GradientRendererProps;
    quad: ReturnType<typeof Vertices>;
    numberOfColors: number;
    colorsTexture: ReturnType<typeof Texture>;
    lissajousUniforms: ReturnType<typeof Uniforms>;
    displayUniforms: ReturnType<typeof Uniforms>;
}) {
    
    const pointInstances = Instances({
        maxInstanceCount: MAX_PARTICLES,
        attributes: {
            instanceId: "int",
        }
    }, {
        count: numberOfColors,
        instances: () => {
            const data = [];
            for (let i = 0; i < numberOfColors; i++) {
                data.push({ instanceId : i });
            }
            return data;
        }
    }, []); 
    const draw = DrawOp(
        quad,
        () => vert,
        () => frag,
        {
            uniforms: {
                lissajousUniforms,
                displayUniforms,
            },
            instances: pointInstances,
            textures: {
                colors: {
                    texture: colorsTexture,
                    sampler: {
                        filter: "nearest",
                        wrap: "edge",
                    }
                }
            }
        },
        {
            depthTest: true,
            blendMode: "alpha",
        }
    )

    return {
        pointInstances,
        data: {
            draw,
        }
    };
}

export default lissajousPointsRenderer;