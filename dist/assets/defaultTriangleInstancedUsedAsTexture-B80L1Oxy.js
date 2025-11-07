import{T as d,D as l,aK as p,aL as v,aM as g,aN as m,aO as x}from"./index-C8bJRjxR.js";import{d as w}from"./blueprint-Cn3NJRII.js";import{Q as f}from"./quad-BG9aJ5vd.js";import"./triangle-DmJoWPF7.js";function b(a){const t=w(a),e=f([{x:-1,y:-1,u:0,v:0},{x:-1,y:1,u:0,v:1},{x:1,y:1,u:1,v:1},{x:1,y:-1,u:1,v:0}],[]),n=d({width:1920,height:1080},[l(e,()=>`
            out vec2 uv;
            void main() {
                gl_Position = position;
                uv = vec2(u, v);
            }
            `,()=>`
            in vec2 uv;
            void main() {
                float gridSize = 8.;
                vec2 localUv = fract(uv * gridSize);
                vec4 texColor = texture(src, localUv);
                outColor = texColor;
            }
            `,{textures:{src:{texture:t.outputTexture,sampler:{wrap:"clamp-to-edge",filter:"linear"}}}})],[]);return{quad:e,outputTexture:n,dti:t}}const i=new p,T=document.getElementById("mainCanvas"),u=T.getContext("webgl2",{antialias:!1});if(!u)throw new Error("Unable to initialize WebGL2");const h=new g(u),s=new v(h);i.subscribe((a,t)=>{const e=Object.fromEntries(a);s.submit(t,e),s.draw("outputTexture")});const y=new m;function c(a){const{addedAssets:t,deletedAssetIds:e,graphId:n}=y.update(b(a));x(t[n]),i.transaction(t,e,n)}const o=document.getElementById("inputRange");let r=parseFloat(o.value)/100;o.addEventListener("input",()=>{r=parseFloat(o.value)/100,c(r)});c(r);
