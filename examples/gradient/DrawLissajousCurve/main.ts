import type { ResourceTypes } from 'pinsandcurves-engine';
type Vertices = ResourceTypes.Vertices;
import { DrawOp, Instances, Texture, Uniforms } from 'pinsandcurves-engine';
import vert from './vert.glsl';
import frag from './frag.glsl';
import type { GradientRendererProps } from "../blueprint";

const LINE_SEGMENTS_COUNT = 10000;

function lissajousCurveRenderer({
    props,
    quad,
    lissajousUniforms,
    displayUniforms,
} : {
    props: GradientRendererProps;
    quad: ReturnType<typeof Vertices>;
    lissajousUniforms: ReturnType<typeof Uniforms>;
    displayUniforms: ReturnType<typeof Uniforms>;
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

    const curveUniforms = Uniforms({
        numLineSegments: 'int',
    }, () => {
        return {
            numLineSegments: LINE_SEGMENTS_COUNT,
        }
    }, [props.time]);

    const draw = DrawOp(
        quad,
        () => vert,
        () => frag,
        {
            uniforms: {
                curveUniforms,
                lissajousUniforms,
                displayUniforms,
            },
            instances: lineSegmentInstances,
        },
        {
            depthTest: true,
            blendMode: "alpha",
        }
    )

    return {
        lineSegmentInstances,
        curveUniforms,
        data: {
            draw,
        }
    };
}

export default lissajousCurveRenderer;