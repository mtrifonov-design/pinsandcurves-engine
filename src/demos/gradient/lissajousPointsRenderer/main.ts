import type { Vertices } from "../../../lib/AuthorLayer";
import { DrawOp, Instances, Texture, Uniforms } from "../../../lib/AuthorLayer";
import vert from './vert.glsl';
import frag from './frag.glsl';


const MAX_PARTICLES = 100;

function lissajousPointsRenderer({
    quad,
    input,
    numberOfColors,
    colorsTexture,
    colorUniforms,
    displayUniforms,
} : {
    quad: ReturnType<typeof Vertices>;
    input: number;
    numberOfColors: number;
    colorsTexture: ReturnType<typeof Texture>;
    colorUniforms: ReturnType<typeof Uniforms>;
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

    // const curveUniforms = Uniforms({
    //     show: 'int',
    //     slider: 'float',
    // }, () => {
    //     return {
    //         show: 1,
    //         slider: input,
    //     }
    // }, [input]);

    const draw = DrawOp(
        quad,
        () => vert,
        () => frag,
        {
            uniforms: {
                //curveUniforms,
                colorUniforms,
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
        }
    )

    return {
        pointInstances,
        //curveUniforms,
        data: {
            draw,
        }
    };
}

export default lissajousPointsRenderer;