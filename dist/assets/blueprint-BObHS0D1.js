import{F as u,A as c,B as r,I as v}from"./drawGraph-CR9K6HS0.js";import{T as f}from"./triangle-BQ-ZmQWp.js";function d(t){const o=f([{x:-.5,y:-.5,u:0,v:0},{x:.5,y:-.5,u:1,v:0},{x:0,y:.5,u:1,v:1}],[]),e=u({attributes:{offset:"vec2"}},{count:100,instances:()=>{const s=[];for(let i=0;i<100;i++)s.push({offset:[Math.random()-.5,Math.random()-.5]});return s}},[]),n=v({scale:"float"},()=>({scale:[t]}),[t]),a=c({width:1920,height:1080},[r(o,()=>`
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
        }`,{uniforms:{uni:n},instances:e})],[]);return{triangle:o,outputTexture:a,instances:e,uniforms:n}}export{d};
