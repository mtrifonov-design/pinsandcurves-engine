import{T as l,D as d,U as v,aK as g,aL as p,aM as m,aN as w,aO as f}from"./index-C8bJRjxR.js";import{T as b}from"./triangle-DmJoWPF7.js";function x(t){const e=b([{x:-.5,y:-.5,u:0,v:0},{x:.5,y:-.5,u:1,v:0},{x:0,y:.5,u:1,v:1}],[]),a=v({scale:"float"},()=>({scale:[t]}),[t]),n=l({width:1920,height:1080},[d(e,()=>`
        out vec2 uv;
        void main() {
            gl_Position = position * vec4(vec3(scale),1.);
            uv = vec2(u, v);
        }
        `,()=>`
        in vec2 uv;
        void main() {
            outColor = vec4(uv, 1.0, 1.0);
        }`,{uniforms:{uni:a}})],[]);return{triangle:e,outputTexture:n,uniforms:a}}const r=new g,T=document.getElementById("mainCanvas"),u=T.getContext("webgl2",{antialias:!1});if(!u)throw new Error("Unable to initialize WebGL2");const h=new m(u),i=new p(h);r.subscribe((t,e)=>{const a=Object.fromEntries(t);i.submit(e,a),i.draw("outputTexture")});const y=new w;function c(t){const{addedAssets:e,deletedAssetIds:a,graphId:n}=y.update(x(t));f(e[n]),r.transaction(e,a,n)}const s=document.getElementById("inputRange");let o=parseFloat(s.value)/100;s.addEventListener("input",()=>{o=parseFloat(s.value)/100,c(o)});c(o);
