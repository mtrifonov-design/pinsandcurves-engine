import{A as f,F as S,I as T,B as P,aK as D,aL as E,aM as V,aN as L}from"./drawGraph-CR9K6HS0.js";import{Q as B}from"./quad-B8d2BRpA.js";function G(e){const a=B([{x:-1,y:-1,u:0,v:0},{x:-1,y:1,u:0,v:1},{x:1,y:1,u:1,v:1},{x:1,y:-1,u:1,v:0}],[]),o=f({width:512,height:512},()=>e.lawnInputImage,[e.lawnMowerPosition.x,e.lawnMowerPosition.y,e.lawnMowerOrientation]),r=f({width:512,height:512},()=>e.lawnMowerInputImage,[]),c=S({attributes:{i_position:"vec2",i_angle:"float",i_shadeVariation:"float",i_heightVariation:"float"},maxInstanceCount:1e6},{count:1e6,instances:()=>{const d=[];for(let m=0;m<1e6;m++)d.push({i_position:[Math.random()-.5,Math.random()-.5],i_angle:Math.random()-.5,i_shadeVariation:Math.random(),i_heightVariation:Math.random()});return d}},[]),n=T({lawnMowerPosition:"vec2",lawnMowerOrientation:"float"},()=>({lawnMowerPosition:[e.lawnMowerPosition.x,e.lawnMowerPosition.y],lawnMowerOrientation:[e.lawnMowerOrientation]}),[e.lawnMowerPosition.x,e.lawnMowerPosition.y,e.lawnMowerOrientation]),h=f({width:1080,height:1080},[P(a,()=>`
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
            `,{textures:{src:{texture:o,sampler:{wrap:"clamp",filter:"nearest"}}},instances:c},{depthTest:!0}),P(a,()=>`
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
            `,{textures:{src:{texture:r,sampler:{wrap:"clamp",filter:"nearest"}}},uniforms:{uni:n}},{blendMode:"alpha"})],[]);return{quad:a,uniforms:n,grasshalmInstances:c,outputTexture:h,lawnMowerInputTexture:r,lawnInputTexture:o}}const R="/pinsandcurves-engine/assets/lawn-mower-CWPatgMc.png",g=document.createElement("canvas");g.width=512;g.height=512;const U=g.getContext("2d"),v=new Image;v.src=R;await new Promise(e=>{v.onload=()=>e(!0)});U.drawImage(v,0,0,512,512);console.log("Lawn Mower example");const I=new E,j=document.getElementById("mainCanvas"),k=j.getContext("webgl2",{antialias:!1});if(!k)throw new Error("Unable to initialize WebGL2");const F=new D(k),_=new V(F);I.subscribe((e,a)=>{const o=Object.fromEntries(e);_.submit(a,o),_.draw("outputTexture")});const W=new L;function q(e){const{addedAssets:a,deletedAssetIds:o,graphId:r}=W.update(G(e));I.transaction(a,o,r)}const u=document.createElement("canvas");u.width=512;u.height=512;const i=u.getContext("2d");i.fillStyle="white";i.fillRect(0,0,512,512);const t={lawnInputImage:u,lawnMowerInputImage:g,lawnMowerPosition:{x:0,y:0},lawnMowerOrientation:0},p=document.createElement("canvas");p.width=16;p.height=16;const M=p.getContext("2d"),Q=Date.now(),w=new Set;document.addEventListener("keydown",e=>{(e.key==="ArrowUp"||e.key==="ArrowDown"||e.key==="ArrowLeft"||e.key==="ArrowRight")&&e.preventDefault(),w.add(e.key)});document.addEventListener("keyup",e=>{(e.key==="ArrowUp"||e.key==="ArrowDown"||e.key==="ArrowLeft"||e.key==="ArrowRight")&&e.preventDefault(),w.delete(e.key)});let s=0;function A(){w.has("ArrowUp")?s+=.02:w.has("ArrowDown")?s-=.02:s*=.98,s=Math.max(Math.min(s,1),-1);const e=.05*s,a=.05;let o=!1,r,c;r=t.lawnMowerPosition.x,c=t.lawnMowerPosition.y,t.lawnMowerPosition.x+=e*Math.cos(t.lawnMowerOrientation),t.lawnMowerPosition.y+=e*Math.sin(t.lawnMowerOrientation),t.lawnMowerPosition.x<-1&&(t.lawnMowerPosition.x=-1,o=!0),t.lawnMowerPosition.x>1&&(t.lawnMowerPosition.x=1,o=!0),t.lawnMowerPosition.y<-1&&(t.lawnMowerPosition.y=-1,o=!0),t.lawnMowerPosition.y>1&&(t.lawnMowerPosition.y=1,o=!0),o&&(s=0),i.strokeStyle="black",i.lineWidth=80,i.beginPath(),i.moveTo((r+.5)*512,(c+.5)*512),i.lineTo((t.lawnMowerPosition.x+.5)*512,(t.lawnMowerPosition.y+.5)*512),i.stroke(),w.has("ArrowLeft")&&(t.lawnMowerOrientation+=a),w.has("ArrowRight")&&(t.lawnMowerOrientation-=a),M.clearRect(0,0,16,16),M.drawImage(u,0,0,512,512,0,0,16,16);const n=M.getImageData(0,0,16,16);let h=!0,d=0;for(let l=0;l<n.data.length;l+=4){const C=n.data[l],b=n.data[l+1],O=n.data[l+2];n.data[l+3];const y=(C+b+O)/3;d+=y,y>25&&(h=!1)}d/=n.data.length/4;const m=Math.floor((Date.now()-Q)/1e3),x=Math.max(0,200-m);h?document.getElementById("clock").innerText="Good job bud! 🎉":x>0?document.getElementById("clock").innerText=`Time Remaining: ${x}s`:document.getElementById("clock").innerText="Time's up! ⏰",q(t),requestAnimationFrame(A)}A();
