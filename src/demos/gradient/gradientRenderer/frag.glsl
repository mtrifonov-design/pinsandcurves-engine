in vec2 v_uv;
flat in int v_numParticles;

const float THRESHOLD = 0.0001;

vec4 fetch(int index) {
  return texelFetch(colors, ivec2(index, 0),0);
}

vec3 lissajous(
    float t,
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
    return vec3(x, y, z);
}

float weightFunction(float distance) {
    float factor = 0.5;
    return 1. / pow((distance), 1.5 + factor * 3.);
}

vec4 getColor(vec3 p) {
    int PCOUNT = v_numParticles; 
    float wTotal = 0.0;
    vec3 accumulatedColor = vec3(0.0);
    bool needsNormalization = true;
    for (int i = 0; i < PCOUNT; ++i) {
        vec3 center = lissajous(
            (float(i) / float(PCOUNT)),
            5.,7.,1.,
            0.4, 0.8, 0.8
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
            float w = weightFunction(distance);
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
    vec4 col = getColor(vec3(uv, slider));
    outColor = col;
}