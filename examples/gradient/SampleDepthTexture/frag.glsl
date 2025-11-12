#include "../shared/constants.glsl";
#include "../shared/lissajous.glsl";

in vec2 v_uv;
flat in int v_numParticles;

void main() {
    vec2 uv = v_uv;
    int PCOUNT = v_numParticles; 
    float sum = 0.0;
    float weightSum = 0.0;
    float sigma2 = 0.1;
    float heightPower = 1. + 10.0;

    for (int i = 0; i < PCOUNT; ++i) {
        vec3 point = lissajous(
            fract(((float(i) + 0.5) / float(PCOUNT)) + time) * 6.2831,
            0.,
            lissajous_a.x,lissajous_b.x,lissajous_c.x,
            lissajous_a.y, lissajous_b.y, lissajous_c.y,
            resolution
        );
        vec2 delta = uv - point.xy;
        float r2 = dot(delta, delta);
        float w = exp(-r2 / sigma2);
        float z = (point.z  + 1.) / 2.;
        float h = pow(z, heightPower); 
        sum += w * h;
        weightSum += w;
    }
    float result = pow(sum / weightSum, 1.0 / heightPower);
    outColor = vec4(vec3(result),1.0);
}