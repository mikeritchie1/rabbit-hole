import { useEffect, useRef } from 'react';

const hash = (x:number,y:number) => { const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n); };
function noise(x:number,y:number){const ix=Math.floor(x),iy=Math.floor(y);let u=x-ix,v=y-iy;u=u*u*(3-2*u);v=v*v*(3-2*v);return (hash(ix,iy)*(1-u)+hash(ix+1,iy)*u)*(1-v)+(hash(ix,iy+1)*(1-u)+hash(ix+1,iy+1)*u)*v;}
function cloud(x:number,y:number){let n=0,a=.55;for(let i=0;i<5;i++){n+=noise(x,y)*a;x=x*2.03+13;y=y*2.03+7;a*=.48;}return n;}

export function Space({flight}:{flight:number}){
  const sky=useRef<HTMLCanvasElement>(null),stars=useRef<HTMLCanvasElement>(null),pulse=useRef(-10000);
  useEffect(()=>{if(flight)pulse.current=performance.now();},[flight]);
  useEffect(()=>{
    const canvas=sky.current!;
    const paint=()=>{
      canvas.width=Math.min(800,innerWidth);canvas.height=Math.round(canvas.width*innerHeight/innerWidth);
      const ctx=canvas.getContext('2d')!,w=canvas.width,h=canvas.height,image=ctx.createImageData(w,h);
      for(let y=0;y<h;y++)for(let x=0;x<w;x++){
        const u=x/w,v=y/h,n=cloud(u*5+5,v*4+4),fine=cloud(u*17,v*13);
        const band=Math.exp(-Math.pow((u*.66+v*.6-.58+(n-.5)*.6)*4.9,2));
        const dust=Math.max(0,n-.28)*band,rift=Math.pow(Math.max(0,fine-.35),1.6),k=(y*w+x)*4;
        image.data[k]=3+dust*23+rift*band*19;image.data[k+1]=6+dust*46+rift*band*37;image.data[k+2]=13+dust*91+rift*band*72;image.data[k+3]=255;
      }
      ctx.putImageData(image,0,0);
      for(let i=0;i<2200;i++){
        const x=hash(i,1)*w,y=hash(i,2)*h,r=hash(i,3),size=r>.994?1.55:r>.94?.8:.35;
        ctx.fillStyle=`rgba(${r>.8?'193,214,255':'166,184,215'},${.15+hash(i,4)*.65})`;ctx.beginPath();ctx.arc(x,y,size,0,Math.PI*2);ctx.fill();
        if(r>.994){const glow=ctx.createRadialGradient(x,y,0,x,y,12);glow.addColorStop(0,'#c7ddff99');glow.addColorStop(.16,'#87b5ff44');glow.addColorStop(1,'#589aff00');ctx.fillStyle=glow;ctx.fillRect(x-12,y-12,24,24);ctx.strokeStyle='#c6dcff66';ctx.lineWidth=.4;ctx.beginPath();ctx.moveTo(x-6,y);ctx.lineTo(x+6,y);ctx.moveTo(x,y-6);ctx.lineTo(x,y+6);ctx.stroke();}
      }
    };
    paint();window.addEventListener('resize',paint);return()=>window.removeEventListener('resize',paint);
  },[]);
  useEffect(()=>{
    const canvas=stars.current!,ctx=canvas.getContext('2d')!,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const points=Array.from({length:160},(_,i)=>({x:(hash(i,11)-.5)*2.4,y:(hash(i,12)-.5)*2.4,z:hash(i,13)*2+.1}));
    let raf=0,last=performance.now();
    const draw=(now:number)=>{
      const dpr=Math.min(devicePixelRatio,2),w=innerWidth,h=innerHeight;
      if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);}
      ctx.clearRect(0,0,w,h);const dt=Math.min((now-last)/1000,.04);last=now;
      const boost=reduced?0:Math.max(0,1-(now-pulse.current)/1500),speed=reduced?0:.013+Math.sin(boost*Math.PI)*1.8;
      for(const p of points){const old=p.z;p.z-=dt*speed;if(p.z<.12)p.z=2.1;const x=w*.5+p.x/p.z*w*.5,y=h*.53+p.y/p.z*h*.5;if(x<0||x>w||y<0||y>h)continue;
        ctx.strokeStyle=`rgba(191,216,255,${Math.min(.7,.42/p.z)})`;ctx.lineWidth=Math.max(.5,1.2/p.z);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(w*.5+p.x/(old+.002+boost*.065)*w*.5,h*.53+p.y/(old+.002+boost*.065)*h*.5);ctx.stroke();}
      if(!reduced)raf=requestAnimationFrame(draw);
    };raf=requestAnimationFrame(draw);return()=>cancelAnimationFrame(raf);
  },[]);
  return <div className="universe" aria-hidden="true"><canvas ref={sky} className="nebula"/><div className="cosmic-haze"/><canvas ref={stars} className="starflight"/><div className="vignette"/></div>;
}
