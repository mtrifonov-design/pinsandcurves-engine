import{I as e,T as c,D as v,U as f}from"./index-C8bJRjxR.js";import{T as l}from"./triangle-DmJoWPF7.js";function g(o,t){const n=l([{x:-.5,y:-.5,u:0,v:0},{x:.5,y:-.5,u:1,v:0},{x:0,y:.5,u:1,v:1}],[t]),s=e({attributes:{offset:"vec2"}},{count:100,instances:()=>{const i=[];for(let u=0;u<100;u++)i.push({offset:[Math.random()-.5,Math.random()-.5]});return i}},[t]),a=f({scale:"float"},()=>({scale:[o]}),[o,t]),r=c({width:1920,height:1080},[v(n,()=>`
        out vec2 uv;
        void main() {
            gl_Position = position * vec4(vec3(scale),1.);
            gl_Position += vec4(offset, 0.0, 0.0);
            uv = vec2(u, v);
        }
        `,()=>`
        in vec2 uv;
        void main() {
            outColor = vec4(uv, 1.0, 1.0);
        }`,{uniforms:{uni:a},instances:s})],[t]);return{triangle:n,outputTexture:r,instances:s,uniforms:a}}export{g as d};
