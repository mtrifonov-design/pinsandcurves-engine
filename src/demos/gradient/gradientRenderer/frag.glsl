#define FBM_OCTAVES 1
#include "../shared/constants.glsl";
#include "../../utils/lygia/generative/fbm.glsl";
#include "../../utils/lygia/generative/cnoise.glsl";
#include "../shared/lissajous.glsl";


in vec2 v_uv;
flat in int v_numParticles;



const float THRESHOLD = 0.0001;

vec4 fetch(int index) {
  return texelFetch(colors, ivec2(index, 0),0);
}



float weightFunction(float distance, float factor) {
    //float factor = 0.5;
    return 1. / pow((distance), 1.5 + factor * 3.);
}

// float getDepth(vec2 p, float t) {
//     int PCOUNT = v_numParticles; 
//     float accumulatedDepth = 0.0;
//     float closestParticle = 1.0;
//     // for (int i = 0; i < PCOUNT; ++i) {
//     //     vec3 center = lissajous(
//     //         fract((float(i) / float(PCOUNT)) + t) * 6.2831,
//     //         1.,2.,1.,
//     //         0.6, 0.4, 1.0
//     //     );
//     //     if (center.z > closestParticle) {
//     //         closestParticle = center.z;
//     //     }
//     // }
//     for (int i = 0; i < PCOUNT; ++i) {
//         vec3 center = lissajous(
//             fract((float(i) / float(PCOUNT))) * 6.2831, t,
//             lissajous_a.x,lissajous_b.x,lissajous_c.x,
//             lissajous_a.y, lissajous_b.y, lissajous_c.y
//         );
//         float zStretch = 3.;
//         float xyStretch = 1.0;
//         vec3 p_adj = vec3(p,closestParticle) * vec3(xyStretch,xyStretch,zStretch);
//         vec3 center_adj = center * vec3(xyStretch,xyStretch,zStretch);
//         float distance = sqrt(dot(p_adj - center_adj, p_adj - center_adj));
//         if (distance < THRESHOLD) {
//             float infinity = 1.0 / 0.0;
//             accumulatedDepth = infinity;
//             break;
//         } else {
//             float w = weightFunction(distance, 1.15);
//             accumulatedDepth += center.z * w;
//         }
//     }
//     return smoothstep(0.,1.,accumulatedDepth);
// }

vec4 getColor(vec3 p, float t) {
    int PCOUNT = v_numParticles; 
    float wTotal = 0.0;
    vec3 accumulatedColor = vec3(0.0);
    bool needsNormalization = true;
    for (int i = 0; i < PCOUNT; ++i) {
        vec3 center = lissajous(
            fract(((float(i) + 0.5) / float(PCOUNT)) + t) * 6.2831,
            0.,
            lissajous_a.x,lissajous_b.x,lissajous_c.x,
            lissajous_a.y, lissajous_b.y, lissajous_c.y,
            resolution
        );
        vec3 p_adj = p * vec3(1.,1.,.5);
        vec3 center_adj = center * vec3(1.,1.,.5);
        float distance = sqrt(dot(p_adj - center_adj, p_adj - center_adj));
        vec4 color = fetch(i);
        if (distance < THRESHOLD) {
            accumulatedColor = color.rgb;
            needsNormalization = false; 
            break;
        } else {
            float w = weightFunction(distance, 1.2);
            wTotal += w;
            accumulatedColor += color.rgb * w;
        }
    }
    
    if (needsNormalization && wTotal > 0.0) {
        accumulatedColor /= vec3(wTotal);
    }

    return vec4(accumulatedColor, 1.0);
}

float periodic2DNoise(vec2 p, float angle, float cylinderRadius) {
    vec3 wp = vec3(p, cylinderRadius);
    mat3 rotAroundZ = mat3(
        cos(angle), 0.,sin(angle),
        0., 1., 0.,
        -sin(angle), 0., cos(angle)
    );
    wp = rotAroundZ * wp;
    float u = cnoise(wp);
    return u;
}

float hemisphere(vec2 uv) {
    return 1. - sqrt(dot(uv, uv)) * .5;
}

vec3 parametricToSphere(vec2 uv) {
    float theta = (uv.x * 0.5 + 0.5) *  PI; // azimuthal angle
    float phi = (uv.y * 0.5 + 0.5) * PI;         // polar angle

    float x = sin(phi) * cos(theta);
    float y = sin(phi) * sin(theta);
    float z = cos(phi);

    return vec3(-x,-z,-y);
}

void main() {
    vec2 uv = v_uv;
    //vec4 col = getColor(vec3(uv, depthMap(uv + fbm(uv) * 0.2,slider)), slider);
    float xyScale = .2;
    float xyRadius = .5;
    float xNoise = periodic2DNoise(uv * xyScale, slider * PI * 2.0, xyRadius);
    float yNoise = periodic2DNoise((uv + vec2(0.5,0.5)) * xyScale, slider * PI * 2.0, xyRadius);
    float zNoise = periodic2DNoise((uv + vec2(0.25,0.75)) * .25, slider * PI * 2.0, 1.05);

    vec2 depthSamplePos = uv; //+ vec2(xNoise, yNoise) * 3.;
    //depthSamplePos *= sin(uv.x * PI * 2. * 50.);
    float depth = 0.; 
    //depth = getDepth(depthSamplePos, slider);
    vec2 noiseDistortion = vec2(xNoise, yNoise);
    noiseDistortion = vec2(0.);
    depth = hemisphere(uv + noiseDistortion );
    //depth = 1.0;
    //depth = pow(zNoise * 0.5 + 0.5,30.) * 2. - 1.;
    //depth += zNoise * .5;
    vec3 samplePos = vec3(uv, depth);
    vec3 sphereSamplePos = parametricToSphere(uv+ noiseDistortion);
    //samplePos += vec3(pnoise(uv + vec2(slider,0.), vec2(1.,1.)));
    //vec4 col = getColor(vec3(uv,-1.), slider);
    vec4 col = getColor(sphereSamplePos, slider);
    outColor = col;
    //outColor = vec4(vec3(sphereSamplePos.z * 0.5 + 0.5), 1.0);
    //outColor = texture(colors, v_uv);
    //outColor = vec4(sphereSamplePos, 1.);
    //outColor = vec4(vec3(depth), 1.0);
}