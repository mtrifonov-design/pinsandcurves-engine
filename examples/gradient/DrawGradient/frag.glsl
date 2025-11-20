#define FBM_OCTAVES 1
#include "../shared/constants.glsl";
#include "../../utils/lygia/generative/fbm.glsl";
#include "../../utils/lygia/generative/cnoise.glsl";
#include "../../utils/lygia/color/space/oklab2rgb.glsl";
#include "../../utils/lygia/color/space/rgb2oklab.glsl"
#include "../../utils/lygia/filter/gaussianBlur/2D.glsl";
#include "../shared/lissajous.glsl";


in vec2 v_uv;
flat in int v_numParticles;

const float THRESHOLD = 0.0001;

vec4 fetch(int index) {
  return texelFetch(colors, ivec2(index, 0),0);
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


vec3 parametricToSphere(vec2 uv) {
    float theta = (uv.x * 0.5 + 0.5) * 1.5* PI; // azimuthal angle
    float phi = (uv.y * 0.5 + 0.5) * PI;         // polar angle

    float x = sin(phi) * cos(theta);
    float y = sin(phi) * sin(theta);
    float z = cos(phi);

    return vec3(-x,-z,-y);
}

float weightFunction(float distance, float factor) {
    return 1. / pow((distance), 1.5 + factor * 3.);
}


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
        vec3 p_adj = p * vec3(1.,1.,2.5);
        vec3 center_adj = center * vec3(1.,1.,2.5);
        float distance = sqrt(dot(p_adj - center_adj, p_adj - center_adj));
        vec4 color = rgb2oklab(fetch(i));
        if (distance < THRESHOLD) {
            accumulatedColor = color.rgb;
            needsNormalization = false; 
            break;
        } else {
            float w = weightFunction(distance, mixingIntensity);
            wTotal += w;
            accumulatedColor += color.rgb * w;
        }
    }
    
    if (needsNormalization && wTotal > 0.0) {
        accumulatedColor /= vec3(wTotal);
    }

    return vec4(accumulatedColor, 1.0);
}

void main() {
    vec2 uv = v_uv;
    // float xyScale = .2;
    // float xyRadius = .5;
    // float xNoise = periodic2DNoise(uv * xyScale, time * PI * 2.0, xyRadius);
    // float yNoise = periodic2DNoise((uv + vec2(0.5,0.5)) * xyScale, time * PI * 2.0, xyRadius);
    // float zNoise = periodic2DNoise((uv + vec2(0.25,0.75)) * .25, time * PI * 2.0, 1.05);

    // vec2 noiseDistortion = vec2(xNoise, yNoise);
    // noiseDistortion = vec2(0.);
    // vec3 sphereSamplePos = parametricToSphere(uv+ noiseDistortion);
    vec2 pixelDirection = vec2(0.05);
    const int kernelSize = 9;
    vec4 blurred = gaussianBlur2D(depth_src, (uv + 1.0) / 2.0, pixelDirection, kernelSize);
    float depthField = blurred.r; // use the blurred depth field
    float d = depthField * 2. - 1.;
    vec3 samplePos = vec3(v_uv, d); 


    vec4 col = getColor(samplePos, time);
    outColor = oklab2rgb(col);
    //outColor = vec4(texture(depth_src, (uv +1.) / 2.).rgb,1.0);
}