#include "../shared/constants.glsl";
#include "../shared/lissajous.glsl";

const int LINE_SEGMENTS = 1000;

vec4 fetch(int index) {
  return texelFetch(colors, ivec2(index, 0),0);
}



out vec2 v_uv;
out vec4 startColor;
out vec4 endColor;
void main() {
    v_uv = position * 0.5 + 0.5; 
    int selfInstanceId = gl_InstanceID;
    float startPos = float(selfInstanceId) / float(LINE_SEGMENTS);
    float endPos = float(selfInstanceId + 1) / float(LINE_SEGMENTS);
    float startColorPosIdx = floor(startPos * float(numParticles));
    float endColorPosIdx = floor(endPos * float(numParticles));
    startColor = fetch(int(startColorPosIdx));
    endColor = fetch(int(endColorPosIdx));
    vec3 startPoint = lissajous(
        startPos * 2. * PI,
        slider,
        1.,2.,1.,
        0.6, 0.4, 1.0
    );
    startPoint.z *= -1.;
    vec3 endPoint = lissajous(
        endPos * 2. * PI,
        slider,
        1.,2.,1.,
        0.6, 0.4, 1.0
    );
    endPoint.z *= -1.;
    startColor.rgb = mix(startColor.rgb, vec3(0.), (startPoint.z * 2.) * 0.5 + 0.5);
    endColor.rgb = mix(endColor.rgb, vec3(0.), (endPoint.z * 2.) * 0.5 + 0.5);
    vec3 translation = startPoint.xyz;
    vec3 diff = endPoint.xyz - startPoint.xyz;
    vec3 pos = vec3(position, 0.) * 0.02 + translation;
    gl_Position = vec4(pos, 1.0);
}