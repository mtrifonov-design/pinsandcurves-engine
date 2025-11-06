flat out int v_numParticles;
out vec2 v_uv;
void main() {
    v_numParticles = numParticles;
    v_uv = position;
    gl_Position = vec4(position, 1.0, 1.0);
}