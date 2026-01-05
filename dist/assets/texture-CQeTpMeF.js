import{A as d,B as l,aK as v,aL as p,aM as g,aN as m,aO as x}from"./drawGraph-CR9K6HS0.js";import{d as f}from"./blueprint-BObHS0D1.js";import{Q as w}from"./quad-B8d2BRpA.js";import"./triangle-BQ-ZmQWp.js";function b(a){const e=f(a),t=w([{x:-1,y:-1,u:0,v:0},{x:-1,y:1,u:0,v:1},{x:1,y:1,u:1,v:1},{x:1,y:-1,u:1,v:0}],[]),n=d({width:1920,height:1080},[l(t,()=>`
            out vec2 uv;
            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
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
            `,{textures:{src:{texture:e.outputTexture,sampler:{wrap:"clamp-to-edge",filter:"linear"}}}})],[]);return{quad:t,outputTexture:n,dti:e}}const i=new p,h=document.getElementById("mainCanvas"),u=h.getContext("webgl2",{antialias:!1});if(!u)throw new Error("Unable to initialize WebGL2");const y=new v(u),r=new g(y);i.subscribe((a,e)=>{const t=Object.fromEntries(a);r.submit(e,t),r.draw("outputTexture")});const A=new m;function c(a){const{addedAssets:e,deletedAssetIds:t,graphId:n}=A.update(b(a));x(e[n]),i.transaction(e,t,n)}const o=document.getElementById("inputRange");let s=parseFloat(o.value)/100;o.addEventListener("input",()=>{s=parseFloat(o.value)/100,c(s)});c(s);
