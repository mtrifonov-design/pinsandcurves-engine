import{T as l,D as p,aK as v,aL as g,aM as m,aN as x,aO as w}from"./index-C8bJRjxR.js";import{d as f}from"./blueprint-B_b2WVqa.js";import{Q as b}from"./quad-BG9aJ5vd.js";import"./triangle-DmJoWPF7.js";function T(a,t){const e=f(a,t),n=b([{x:-1,y:-1,u:0,v:0},{x:-1,y:1,u:0,v:1},{x:1,y:1,u:1,v:1},{x:1,y:-1,u:1,v:0}],[t]),d=l({width:1920,height:1080},[p(n,()=>`
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
            `,{textures:{src:{texture:e.outputTexture,sampler:{wrap:"clamp-to-edge",filter:"linear"}}}})],[t]);return{quad:n,outputTexture:d,dti:e}}const i=new v,h=document.getElementById("mainCanvas"),u=h.getContext("webgl2",{antialias:!1});if(!u)throw new Error("Unable to initialize WebGL2");const y=new m(u),s=new g(y);i.subscribe((a,t)=>{const e=Object.fromEntries(a);s.submit(t,e),s.draw("outputTexture")});const I=new x;function c(a){const{addedAssets:t,deletedAssetIds:e,graphId:n}=I.update(T(a));w(t[n]),i.transaction(t,e,n)}const r=document.getElementById("inputRange");let o=parseFloat(r.value)/100;r.addEventListener("input",()=>{o=parseFloat(r.value)/100,c(o)});c(o);
