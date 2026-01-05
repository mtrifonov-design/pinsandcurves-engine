import{A as f,F as D,I as T,B as _,aK as V,aL as E,aM as L,aN as B}from"./drawGraph-CR9K6HS0.js";import{Q as G}from"./quad-B8d2BRpA.js";function R(t){const a=G([{x:-1,y:-1,u:0,v:0},{x:-1,y:1,u:0,v:1},{x:1,y:1,u:1,v:1},{x:1,y:-1,u:1,v:0}],[]),o=f({width:512,height:512},()=>t.lawnInputImage,[t.lawnMowerPosition.x,t.lawnMowerPosition.y,t.lawnMowerOrientation]),r=f({width:512,height:512},()=>t.lawnMowerInputImage,[]),c=D({attributes:{i_position:"vec2",i_angle:"float",i_shadeVariation:"float",i_heightVariation:"float"},maxInstanceCount:1e6},{count:1e6,instances:()=>{const d=[];for(let h=0;h<1e6;h++)d.push({i_position:[Math.random()-.5,Math.random()-.5],i_angle:Math.random()-.5,i_shadeVariation:Math.random(),i_heightVariation:Math.random()});return d}},[]),n=T({lawnMowerPosition:"vec2",lawnMowerOrientation:"float"},()=>({lawnMowerPosition:[t.lawnMowerPosition.x,t.lawnMowerPosition.y],lawnMowerOrientation:[t.lawnMowerOrientation]}),[t.lawnMowerPosition.x,t.lawnMowerPosition.y,t.lawnMowerOrientation]),g=f({width:1080,height:1080},[_(a,()=>`
            out vec2 uv;
            out float v_shadeVariation;
            flat out int v_shortGrass;
            void main() {
                uv = vec2(u, v);
                v_shortGrass = texture(src, i_position + vec2(0.5)).r > 0.5 ? 1 : 0;
                float angle = i_angle * 3.14159 * (v_shortGrass == 1 ? 0.25 : .15);
                mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
                float height = v_shortGrass == 1 ? 0.09 : 0.05;
                height = height * (0.3 + i_heightVariation * 0.7);
                vec2 finalPos = i_position + vec2(0.003, height) * uv * rotation;
                gl_Position = vec4(finalPos,i_position.y, 1.0);
                v_shadeVariation = i_shadeVariation;
            }
            `,()=>`
            in vec2 uv;
            in float v_shadeVariation;
            flat in int v_shortGrass;
            void main() {
                outColor = vec4((0.0) + v_shadeVariation * 0.3, 
                1.0 - v_shadeVariation * (v_shortGrass == 0 ? 0.3 : 0.8), 0.0, 1.0);
            }
            `,{textures:{src:{texture:o,sampler:{wrap:"clamp",filter:"nearest"}}},instances:c},{depthTest:!0}),_(a,()=>`
            out vec2 uv;
            void main() {
                uv = vec2(u, v);
                float angle = lawnMowerOrientation - 3.14159 / 2.0;
                mat2 rotation = mat2(
                    cos(angle), -sin(angle),
                    sin(angle), cos(angle)
                );
                float scale = 0.1;
                float aspect = 1.5;
                vec2 finalPos = 
                    ((position.xy + vec2(0.,-0.5)) * vec2(1.,aspect) * rotation) * scale
                    + lawnMowerPosition + vec2(0.0,0.075);
                gl_Position = vec4(finalPos, 0., 1.0);
            }
            `,()=>`
            in vec2 uv;
            void main() {
            vec4 lawnMowerColor = texture(src, uv);
            outColor = lawnMowerColor;
            }
            `,{textures:{src:{texture:r,sampler:{wrap:"clamp",filter:"nearest"}}},uniforms:{uni:n}},{blendMode:"alpha"})],[]);return{quad:a,uniforms:n,grasshalmInstances:c,outputTexture:g,lawnMowerInputTexture:r,lawnInputTexture:o}}const U="/pinsandcurves-engine/assets/lawn-mower-p4ORg5DP.png",m=document.createElement("canvas");m.width=512;m.height=512;const $=m.getContext("2d"),v=new Image;v.src=U;await new Promise(t=>{v.onload=()=>t(!0)});$.drawImage(v,0,0,512,512);console.log("Lawn Mower example");const k=new E,F=document.getElementById("mainCanvas"),A=F.getContext("webgl2",{antialias:!1});if(!A)throw new Error("Unable to initialize WebGL2");const j=new V(A),I=new L(j);k.subscribe((t,a)=>{const o=Object.fromEntries(t);I.submit(a,o),I.draw("outputTexture")});const q=new B;function Q(t){const{addedAssets:a,deletedAssetIds:o,graphId:r}=q.update(R(t));k.transaction(a,o,r)}const u=document.createElement("canvas");u.width=512;u.height=512;const i=u.getContext("2d");i.fillStyle="white";i.fillRect(0,0,512,512);const e={lawnInputImage:u,lawnMowerInputImage:m,lawnMowerPosition:{x:0,y:0},lawnMowerOrientation:0},p=document.createElement("canvas");p.width=16;p.height=16;const M=p.getContext("2d"),W=Date.now(),w=new Set;document.addEventListener("keydown",t=>{(t.key==="ArrowUp"||t.key==="ArrowDown"||t.key==="ArrowLeft"||t.key==="ArrowRight")&&t.preventDefault(),w.add(t.key)});document.addEventListener("keyup",t=>{(t.key==="ArrowUp"||t.key==="ArrowDown"||t.key==="ArrowLeft"||t.key==="ArrowRight")&&t.preventDefault(),w.delete(t.key)});let s=0;function S(){w.has("ArrowUp")?s+=.02:w.has("ArrowDown")?s-=.02:s*=.98,s=Math.max(Math.min(s,1),-1);const t=.05*s,a=.05;let o=!1,r,c;r=e.lawnMowerPosition.x,c=e.lawnMowerPosition.y,e.lawnMowerPosition.x+=t*Math.cos(e.lawnMowerOrientation),e.lawnMowerPosition.y+=t*Math.sin(e.lawnMowerOrientation),e.lawnMowerPosition.x<-1&&(e.lawnMowerPosition.x=-1,o=!0),e.lawnMowerPosition.x>1&&(e.lawnMowerPosition.x=1,o=!0),e.lawnMowerPosition.y<-1&&(e.lawnMowerPosition.y=-1,o=!0),e.lawnMowerPosition.y>1&&(e.lawnMowerPosition.y=1,o=!0),o&&(s=0),i.strokeStyle="black",i.lineWidth=80,i.beginPath(),i.moveTo((r+.5)*512,(c+.5)*512),i.lineTo((e.lawnMowerPosition.x+.5)*512,(e.lawnMowerPosition.y+.5)*512),i.stroke(),w.has("ArrowLeft")&&(e.lawnMowerOrientation+=a),w.has("ArrowRight")&&(e.lawnMowerOrientation-=a),M.clearRect(0,0,16,16),M.drawImage(u,0,0,512,512,0,0,16,16);const n=M.getImageData(0,0,16,16);let g=!0,d=0;for(let l=0;l<n.data.length;l+=4){const C=n.data[l],O=n.data[l+1],b=n.data[l+2];n.data[l+3];const P=(C+O+b)/3;d+=P,P>5&&(g=!1)}d/=n.data.length/4;const h=Math.floor((Date.now()-W)/1e3),x=String(Math.floor(h/60)).padStart(2,"0"),y=String(h%60).padStart(2,"0");g?document.getElementById("clock").innerText=`Done!. Time: ${x}:${y} 🎉`:document.getElementById("clock").innerText=`Time: ${x}:${y}`,Q(e),requestAnimationFrame(S)}S();
