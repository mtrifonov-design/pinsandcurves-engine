
in vec4 color;
in float depth;
in vec2 v_uv;
void main() {
    vec4 depthCol = mix(vec4(1.,.5,.5,1.), vec4(0.05,0.05,.5,1.), depth);
    float gradVal = smoothstep(0.1, 0.3, v_uv.y) * smoothstep(.9, 0.7, v_uv.y);
    vec4 col = mix(depthCol, color, 1.-gradVal);
    outColor = vec4(col.rgb, 1.);
}