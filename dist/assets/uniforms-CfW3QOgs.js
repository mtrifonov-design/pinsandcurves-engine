import{T as l,D as d,U as v,aK as g,aL as m,aM as p,aN as f,aO as w}from"./drawGraph-BB9Tqwnu.js";import{T as b}from"./triangle-1XGNmneo.js";function x(t){const e=b([{x:-.5,y:-.5,u:0,v:0},{x:.5,y:-.5,u:1,v:0},{x:0,y:.5,u:1,v:1}],[]),n=v({scale:"float"},()=>({scale:[t]}),[t]),a=l({width:1920,height:1080},[d(e,()=>`
        out vec2 uv;
        void main() {
            gl_Position = position * vec4(vec3(scale),1.);
            uv = vec2(u, v);
        }
        `,()=>`
        in vec2 uv;
        void main() {
            outColor = vec4(uv, 1.0, 1.0);
        }`,{uniforms:{uni:n}})],[]);return{triangle:e,outputTexture:a,uniforms:n}}const r=new g,T=document.getElementById("mainCanvas"),u=T.getContext("webgl2",{antialias:!1});if(!u)throw new Error("Unable to initialize WebGL2");const h=new p(u),i=new m(h);r.subscribe((t,e)=>{const n=Object.fromEntries(t);i.submit(e,n),i.draw("outputTexture")});const y=new f;function c(t){const{addedAssets:e,deletedAssetIds:n,graphId:a}=y.update(x(t));w(e[a]),r.transaction(e,n,a)}const s=document.getElementById("inputRange");let o=parseFloat(s.value)/100;s.addEventListener("input",()=>{o=parseFloat(s.value)/100,c(o)});c(o);
