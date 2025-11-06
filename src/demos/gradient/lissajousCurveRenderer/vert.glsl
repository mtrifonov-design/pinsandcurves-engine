#include "../shared/constants.glsl";
#include "../shared/lissajous.glsl";



vec4 fetch(int index) {
  return texelFetch(colors, ivec2(index, 0),0);
}



out vec2 v_uv;
out vec4 color;
out float depth;
out float actualDepth;
void main() {
    v_uv = position * 0.5 + 0.5; 
    int selfInstanceId = gl_InstanceID;
    float startPos = float(selfInstanceId) / float(numLineSegments);
    float endPos = float(selfInstanceId + 1) / float(numLineSegments);
    float colorPosIdx = floor(startPos * float(numParticles));
    color = fetch(int(colorPosIdx));
    // startPos += slider;
    // endPos += slider;
    startPos = fract(startPos);
    endPos = fract(endPos);
    vec3 startPoint = lissajous(
        startPos * 2. * PI,
        0.,
        lissajous_a.x,lissajous_b.x,lissajous_c.x,
        lissajous_a.y, lissajous_b.y, lissajous_c.y,
        resolution
    );
    vec3 endPoint = lissajous(
        endPos * 2. * PI,
        0.,
        lissajous_a.x,lissajous_b.x,lissajous_c.x,
        lissajous_a.y, lissajous_b.y, lissajous_c.y,
        resolution
    );
    depth = smoothstep(-0.4,0.4,(startPoint.z + endPoint.z) * 0.5);
    actualDepth = (startPoint.z + endPoint.z) * 0.5;
    vec3 translation = startPoint.xyz;
    vec2 diff = endPoint.xy - startPoint.xy;
    float angle = atan(diff.y, diff.x);
    mat2 rot = mat2(
        cos(angle), sin(angle),
        -sin(angle), cos(angle)
    );
    vec2 scaledPosition = position * vec2(0.01,0.01);
    vec2 rotatedPosition = rot * scaledPosition;
    vec3 pos = vec3(rotatedPosition, 0.)  + translation;
    gl_Position = vec4(pos, 1.0);
}