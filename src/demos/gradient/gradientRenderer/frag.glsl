in vec2 v_uv;
in int v_numParticles;

float fetch(int index) {
  return texelFetch(colors, ivec2(index, 0), 0).r;
}


vec4 getColor(vec3 p) {
    int PCOUNT = int(v_numParticles); // number of particles
    float wTotal = 0.0;
    float u_r = 0.0;
    float u_g = 0.0;
    float u_b = 0.0;
    bool needsNormalization = true;
    for (int i = 0; i < PCOUNT; ++i) {
        int base = i * STRIDE;
        vec3 center = vec3(fetch(base), fetch(base + 1), fetch(base+2));
        vec3 p_adj = p * vec3(1.,1.,2.5);
        vec3 center_adj = center * vec3(1.,1.,2.5);
        float distance = sqrt(dot(p_adj - center_adj, p_adj - center_adj));
        float r = fetch(base + 3);
        float g = fetch(base + 4);
        float b = fetch(base + 5);
        if (distance < 0.01) {
            u_r = r;
            u_g = g;
            u_b = b;
            needsNormalization = false; 
            break;
        } else {
            float w = 1. / pow((distance), 1.5 + v_slice * 3.);
            wTotal += w;
            u_r += r * w;
            u_g += g * w;
            u_b += b * w;
        }
    }
    
    if (needsNormalization && wTotal > 0.0) {
        u_r /= wTotal;
        u_g /= wTotal;
        u_b /= wTotal;
    }

    return vec4(u_r, u_g, u_b, 1.0); 
}

void main() {
    vec2 uv = v_uv;
    vec4 col = getColor(vec3(uv, 0.));
    outColor = col;
}