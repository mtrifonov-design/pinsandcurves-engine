#include "../../utils/lygia/distort/grain.glsl"

in vec2 v_uv;
void main() {
    vec2 uv = v_uv;
    vec4 col = texture(src, uv);
    outColor = col;
    float grainValue = grain(uv, resolution, time);
    outColor.rgb += (grainValue - 0.5) * noiseIntensity * 0.8;
}