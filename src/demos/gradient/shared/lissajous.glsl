vec3 lissajous(
    float t,
    float angle,
    float a,
    float b,
    float c,
    float a_delta,
    float b_delta,
    float c_delta,
    vec2 resolution
) {
    float x = cos(a * t + a_delta + angle * 2. * PI);
    float y = cos(b * t + b_delta + angle * 2. * PI);
    float z = cos(c * t + c_delta + angle * 2. * PI);
    // mat3 rotAroundY = mat3(
    //     cos(angle * 2. * PI), 0., sin(angle * 2. * PI),
    //     0., 1., 0.,
    //     -sin(angle * 2. * PI), 0., cos(angle * 2. * PI)
    // );
    // float x = (t / (2. * PI)) * 2. - 1.;
    // float y = 0.;
    // float z = 0.; // t * 2. - 1.;
    //vec3 rotated = rotAroundY * vec3(x, y, z);
    vec3 rotated = vec3(x,y,z);
    float scale = .4;
    float aspect = resolution.x / resolution.y;
    return rotated * vec3(scale / aspect, scale, scale);
}