#include "../shared/constants.glsl";
#include "../shared/lissajous.glsl";

vec4 fetch(int index) {
  return texelFetch(colors, ivec2(index, 0),0);
}

out vec2 v_uv;
out vec4 col;
out float depth;
void main() {
    v_uv = position * 0.5 + 0.5; 
    int selfInstanceId = gl_InstanceID;
    float pos = (float(selfInstanceId) + 0.5) / float(numParticles);
    vec4 color = fetch(int(selfInstanceId));
    col = color;
    pos += time;
    pos = fract(pos);
    
    vec3 point = lissajous(
        pos * 2. * PI,
        0.,
        lissajous_a.x,lissajous_b.x,lissajous_c.x,
        lissajous_a.y, lissajous_b.y, lissajous_c.y,
        resolution
    );
    float aspect = resolution.x / resolution.y;
    vec3 finalPoint = vec3(position* vec2(0.025) * vec2(1.,aspect), 0.)  + point;
        depth = smoothstep(-0.4,0.4,finalPoint.z);
    finalPoint.z -= 0.15;

    // finalPoint.z *= 2.;
    gl_Position = vec4(finalPoint, 1.0);
}