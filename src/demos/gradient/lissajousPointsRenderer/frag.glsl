

in vec4 col;
in vec2 v_uv;
in float depth;
void main() {
    float alpha = smoothstep(0.5, 0.4, length(v_uv - vec2(0.5)));
    vec4 depthCol = mix(vec4(1.,1.,1.,1.), vec4(0.2,0.2,0.2,1.), depth);
    vec4 fringeColor = depthCol;
    vec4 midColor = col;
    vec4 colVal = mix(midColor, fringeColor, smoothstep(0.25, 0.4, length(v_uv - vec2(0.5))));
    outColor = vec4(colVal.rgb * alpha, alpha);
}