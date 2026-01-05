import{A as l,B as d,I as v,aK as g,aL as m,aM as p,aN as f,aO as w}from"./drawGraph-tqQ3UCYH.js";import{T as b}from"./triangle-BjwoFxJ5.js";function x(t){const e=b([{x:-.5,y:-.5,u:0,v:0},{x:.5,y:-.5,u:1,v:0},{x:0,y:.5,u:1,v:1}],[]),a=v({scale:"float"},()=>({scale:[t]}),[t]),n=l({width:1920,height:1080},[d(e,()=>`
        out vec2 uv;
        void main() {
            gl_Position = position * vec4(vec3(scale),1.);
            uv = vec2(u, v);
        }
        `,()=>`
        in vec2 uv;
        void main() {
            outColor = vec4(uv, 1.0, 1.0);
        }`,{uniforms:{uni:a}})],[]);return{triangle:e,outputTexture:n,uniforms:a}}const u=new m,h=document.getElementById("mainCanvas"),r=h.getContext("webgl2",{antialias:!1});if(!r)throw new Error("Unable to initialize WebGL2");const I=new g(r),i=new p(I);u.subscribe((t,e)=>{const a=Object.fromEntries(t);i.submit(e,a),i.draw("outputTexture")});const y=new f;function c(t){const{addedAssets:e,deletedAssetIds:a,graphId:n}=y.update(x(t));w(e[n]),u.transaction(e,a,n)}const s=document.getElementById("inputRange");let o=parseFloat(s.value)/100;s.addEventListener("input",()=>{o=parseFloat(s.value)/100,c(o)});c(o);
