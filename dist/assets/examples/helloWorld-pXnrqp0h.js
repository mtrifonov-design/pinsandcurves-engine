import{V as v,T as d,D as l,aK as p,aL as g,aM as w,aN as m,aO as b}from"../index-C8bJRjxR.js";function f(e,t){const n=v({attributes:{pos:"vec2",uv:"vec2"}},{triangleCount:1,vertices:()=>[{pos:[-1,-1],uv:[0,0]},{pos:[0,e],uv:[0,1]},{pos:[1,-1],uv:[1,0]}],indices:()=>[0,1,2]},[e,t]),a=d({width:1920,height:1080},[l(n,()=>`
                out vec2 v_uv;
                void main() {
                    gl_Position = vec4(pos,0.,1.);
                    v_uv = uv;
                }
                `,()=>`
                in vec2 v_uv;
                void main() {
                    outColor = vec4(v_uv, 1.0, 1.0);
                }`)],[t]);return{triangle:n,outputTexture:a}}const u=new p,h=document.getElementById("mainCanvas"),r=h.getContext("webgl2",{antialias:!1});if(!r)throw new Error("Unable to initialize WebGL2");const x=new w(r),i=new g(x);u.subscribe((e,t)=>{const n=Object.fromEntries(e);i.submit(t,n),i.draw("outputTexture")});const B=new m;function c(e){const{addedAssets:t,deletedAssetIds:n,graphId:a}=B.update(f(e));b(t[a]),u.transaction(t,n,a)}const s=document.getElementById("inputRange");let o=parseFloat(s.value)/100;s.addEventListener("input",()=>{o=parseFloat(s.value)/100,c(o)});c(o);
