
function renderTextures(vertices: PreResource, uniforms: PreResource): PreResourceGraph {
  const t = Texture({
    width: 256,
    height: 256,
  }, [
    DrawOp(
      vertices,
      () => `
      void main() {
          gl_Position = position * vec4(vec3(scale),1.);
      }`,
      () => `
      void main() {
            outColor = vec4(scale,scale,scale,1.);
      }`,
      {
        uniforms: {
          u: uniforms,
        },
        textures: {},
      }
    )
  ], []);
  return {
    t
  }
}

function mainRender(input: number) {
  const a = Quad([
    { x: -0.5, y: -0.5  },
    { x: 0.5, y: -0.5  },
    { x: 0.5, y: 0.5  },
    { x: -0.5, y: 0.5  },
  ], []);
  const u = Uniforms({
    scale: 'float'
  }, () => ({
    scale: [input]
  }), [input]);
  const c = renderTextures(a, u);
  return { a,c,u };
}