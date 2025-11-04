#define FBM_OCTAVES 1
#include "../../utils/lygia/generative/fbm.glsl";
#include "../../utils/lygia/generative/cnoise.glsl";

in vec2 v_uv;
flat in int v_numParticles;

#define PI 3.14159265359

const float THRESHOLD = 0.0001;

vec4 fetch(int index) {
  return texelFetch(colors, ivec2(index, 0),0);
}

vec3 lissajous(
    float t,
    float angle,
    float a,
    float b,
    float c,
    float a_delta,
    float b_delta,
    float c_delta
) {
    float x = cos(a * t + a_delta);
    float y = cos(b * t + b_delta);
    float z = cos(c * t + c_delta);
    mat3 rotAroundY = mat3(
        cos(angle * 2. * PI), 0., sin(angle * 2. * PI),
        0., 1., 0.,
        -sin(angle * 2. * PI), 0., cos(angle * 2. * PI)
    );
    vec3 rotated = rotAroundY * vec3(x, y, z);
    return rotated; // * vec3(0.5,0.5,1.);
}

float weightFunction(float distance, float factor) {
    //float factor = 0.5;
    return 1. / pow((distance), 1.5 + factor * 3.);
}

float getDepth(vec2 p, float t) {
    int PCOUNT = v_numParticles; 
    float accumulatedDepth = 0.0;
    float closestParticle = 1.0;
    // for (int i = 0; i < PCOUNT; ++i) {
    //     vec3 center = lissajous(
    //         fract((float(i) / float(PCOUNT)) + t) * 6.2831,
    //         1.,2.,1.,
    //         0.6, 0.4, 1.0
    //     );
    //     if (center.z > closestParticle) {
    //         closestParticle = center.z;
    //     }
    // }
    for (int i = 0; i < PCOUNT; ++i) {
        vec3 center = lissajous(
            fract((float(i) / float(PCOUNT))) * 6.2831, t,
            1.,2.,1.,
            0.6, 0.4, 1.0
        );
        float zStretch = 3.;
        float xyStretch = 1.0;
        vec3 p_adj = vec3(p,closestParticle) * vec3(xyStretch,xyStretch,zStretch);
        vec3 center_adj = center * vec3(xyStretch,xyStretch,zStretch);
        float distance = sqrt(dot(p_adj - center_adj, p_adj - center_adj));
        if (distance < THRESHOLD) {
            float infinity = 1.0 / 0.0;
            accumulatedDepth = infinity;
            break;
        } else {
            float w = weightFunction(distance, 1.15);
            accumulatedDepth += center.z * w;
        }
    }
    return smoothstep(0.,1.,accumulatedDepth);
}

vec4 getColor(vec3 p, float t) {
    int PCOUNT = v_numParticles; 
    float wTotal = 0.0;
    vec3 accumulatedColor = vec3(0.0);
    bool needsNormalization = true;
    for (int i = 0; i < PCOUNT; ++i) {
        vec3 center = lissajous(
            fract((float(i) / float(PCOUNT))) * 6.2831, t,
            1.,2.,1.,
            0.6, 0.4, 1.0
        );
        vec3 p_adj = p * vec3(1.,1.,2.5);
        vec3 center_adj = center * vec3(1.,1.,2.5);
        float distance = sqrt(dot(p_adj - center_adj, p_adj - center_adj));
        vec4 color = fetch(i);
        if (distance < THRESHOLD) {
            accumulatedColor = color.rgb;
            needsNormalization = false; 
            break;
        } else {
            float w = weightFunction(distance, 3.2);
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
    depth = getDepth(depthSamplePos, slider);
    vec2 noiseDistortion = vec2(xNoise, yNoise) * 0.25;
    noiseDistortion = vec2(0.);
    depth = hemisphere(uv + noiseDistortion );
    //depth = 1.0;
    //depth = pow(zNoise * 0.5 + 0.5,30.) * 2. - 1.;
    //depth += zNoise * .5;
    vec3 samplePos = vec3(uv, depth);
    //samplePos += vec3(pnoise(uv + vec2(slider,0.), vec2(1.,1.)));
    vec4 col = getColor(samplePos, slider);
    outColor = col;

    //outColor = vec4(vec3(depth), 1.0);
}