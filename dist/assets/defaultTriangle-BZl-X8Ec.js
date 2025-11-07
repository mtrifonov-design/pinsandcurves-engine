import{T as d,D as v,U as g,aK as p,aL as m,aM as w,aN as f,aO as b}from"./index-C8bJRjxR.js";import{T as x}from"./triangle-DmJoWPF7.js";function T(e,t){const a=x([{x:-.5,y:-.5,u:0,v:0},{x:.5,y:-.5,u:1,v:0},{x:0,y:.5,u:1,v:1}],[t]),n=g({scale:"float"},()=>({scale:[e]}),[e,t]),l=d({width:1920,height:1080},[v(a,()=>`
        out vec2 uv;
        void main() {
            gl_Position = position * vec4(vec3(scale),1.);
            uv = vec2(u, v);
        }
        `,()=>`
        in vec2 uv;
        void main() {
            outColor = vec4(uv, 1.0, 1.0);
        }`,{uniforms:{uni:n}})],[t]);return{triangle:a,outputTexture:l,uniforms:n}}const r=new p,h=document.getElementById("mainCanvas"),u=h.getContext("webgl2",{antialias:!1});if(!u)throw new Error("Unable to initialize WebGL2");const y=new w(u),i=new m(y);r.subscribe((e,t)=>{const a=Object.fromEntries(e);i.submit(t,a),i.draw("outputTexture")});const B=new f;function c(e){const{addedAssets:t,deletedAssetIds:a,graphId:n}=B.update(T(e));b(t[n]),r.transaction(t,a,n)}const s=document.getElementById("inputRange");let o=parseFloat(s.value)/100;s.addEventListener("input",()=>{o=parseFloat(s.value)/100,c(o)});c(o);
