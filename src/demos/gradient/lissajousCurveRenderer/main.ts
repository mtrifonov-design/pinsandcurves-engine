import type { Vertices } from "../../../lib/AuthorLayer";
import { DrawOp, Instances, Texture, Uniforms } from "../../../lib/AuthorLayer";
import vert from './vert.glsl';
import frag from './frag.glsl';

const LINE_SEGMENTS_COUNT = 1000;

function lissajousCurveRenderer({
    quad,
    input,
    colorsTexture,
    colorUniforms,
} : {
    quad: ReturnType<typeof Vertices>;
    input: number;
    colorsTexture: ReturnType<typeof Texture>;
    colorUniforms: ReturnType<typeof Uniforms>;
}) {

    const lineSegmentInstances = Instances({
        maxInstanceCount: LINE_SEGMENTS_COUNT,
        attributes: {
            instanceId: "int",
        }
    }, {
        count: LINE_SEGMENTS_COUNT,
        instances: () => {
            const data = [];
            for (let i = 0; i < LINE_SEGMENTS_COUNT; i++) {
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
            },
            instances: lineSegmentInstances,
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
        lineSegmentInstances,
        //curveUniforms,
        data: {
            draw,
        }
    };
}

export default lissajousCurveRenderer;