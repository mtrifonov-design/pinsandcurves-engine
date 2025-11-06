
in float depth;
in vec2 v_uv;
in float actualDepth;
void main() {
    vec4 depthCol = mix(vec4(1.,1.,1.,1.), vec4(0.2,0.2,0.2,1.), depth);
    float gradVal = smoothstep(0.1, 0.5, v_uv.y) * smoothstep(.9, 0.5, v_uv.y);
    float alpha = smoothstep(0.1,0.2, v_uv.y) * smoothstep(.9,0.8, v_uv.y);
    depthCol = mix(depthCol, vec4(0.2,0.2,0.2,1.), 1.-gradVal);
    outColor = vec4(depthCol.rgb * alpha, alpha);
}