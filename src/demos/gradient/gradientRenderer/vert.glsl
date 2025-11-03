out int v_numParticles;
out vec2 v_uv;
void main() {
    v_numParticles = numParticles;
    v_uv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
}