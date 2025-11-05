
in vec4 startColor;
in vec4 endColor;
in vec2 v_uv;
void main() {
    outColor = mix(startColor, endColor, v_uv.x);
}