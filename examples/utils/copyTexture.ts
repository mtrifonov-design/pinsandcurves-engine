import { DrawOp } from 'pinsandcurves-engine';


function copyTexture(quad, texture) {
    return DrawOp(
          quad,
          () => `
          out vec2 v_uv;
          void main() {
            gl_Position = vec4(position, 0.0, 1.0);
            v_uv = vec2(u,v);
          }`,
          () => `
          in vec2 v_uv;
          void main() {
            vec4 color = texture(src, v_uv);
            outColor = color;
          }`,
          {
            uniforms: {},
            textures: {
              src: {
                sampler: {
                  edge: 'clamp',
                  filter: 'linear',
                },
                texture: texture,
              },
            },
    })
}

export default copyTexture;