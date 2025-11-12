out vec2 v_uv;
flat out int v_numParticles;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
    v_uv = position;
    v_numParticles = numParticles;
}

