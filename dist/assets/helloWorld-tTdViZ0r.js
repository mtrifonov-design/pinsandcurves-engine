import{V as v,T as d,D as l,aK as p,aL as g,aM as w,aN as m,aO as b}from"./index-C8bJRjxR.js";function f(t){const e=v({attributes:{pos:"vec2",uv:"vec2"}},{triangleCount:1,vertices:()=>[{pos:[-1,-1],uv:[0,0]},{pos:[0,t],uv:[0,1]},{pos:[1,-1],uv:[1,0]}],indices:()=>[0,1,2]},[t]),n=d({width:1920,height:1080},[l(e,()=>`
                out vec2 v_uv;
                void main() {
                    gl_Position = vec4(pos,0.,1.);
                    v_uv = uv;
                }
                `,()=>`
                in vec2 v_uv;
                void main() {
                    outColor = vec4(v_uv, 1.0, 1.0);
                }`)],[]);return{triangle:e,outputTexture:n}}const u=new p,h=document.getElementById("mainCanvas"),r=h.getContext("webgl2",{antialias:!1});if(!r)throw new Error("Unable to initialize WebGL2");const x=new w(r),i=new g(x);u.subscribe((t,e)=>{const n=Object.fromEntries(t);i.submit(e,n),i.draw("outputTexture")});const B=new m;function c(t){const{addedAssets:e,deletedAssetIds:n,graphId:o}=B.update(f(t));b(e[o]),u.transaction(e,n,o)}const a=document.getElementById("inputRange");let s=parseFloat(a.value)/100;a.addEventListener("input",()=>{s=parseFloat(a.value)/100,c(s)});c(s);
