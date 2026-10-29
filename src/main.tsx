import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUp, ArrowDown, History, Maximize, Minimize, X, ArrowUpRight, Play, Compass, Sparkles, Orbit, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { topics } from './data';
import { back, visit, randomTopic, parseHash, placeHash, type Journey, type Place } from './navigation';
import type { Topic } from './schema';
import { Space } from './Space';
import './styles.css';

function readPlaces(key:string):Place[]{try{const raw=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(raw)?raw.filter(p=>p&&topics.some(t=>t.id===p.topicId&&Number.isInteger(p.level)&&p.level>=1&&p.level<=t.levels.length)).slice(-200):[];}catch{return [];}}
function save(key:string,value:unknown){try{localStorage.setItem(key,JSON.stringify(value));}catch{}}
const same=(a:Place,b:Place)=>a.topicId===b.topicId&&a.level===b.level;
function SafeImage({src,alt}:{src:string;alt:string}){const [failed,setFailed]=useState(false);useEffect(()=>setFailed(false),[src]);return failed?<div className="image-fallback" role="img" aria-label={alt}><Orbit size={48}/></div>:<img src={src} alt={alt} draggable={false} onError={()=>setFailed(true)}/>;}

function FittedText({children,className=''}:{children:React.ReactNode;className?:string}){
  const ref=useRef<HTMLDivElement>(null);
  useLayoutEffect(()=>{const el=ref.current!;let mounted=true;const fit=()=>{if(!mounted)return;el.style.fontSize='';let size=parseFloat(getComputedStyle(el).fontSize);while(el.scrollHeight>el.clientHeight+1&&size>9){size-=.5;el.style.fontSize=`${size}px`;}};const observer=new ResizeObserver(fit);observer.observe(el);void document.fonts.ready.then(fit);fit();return()=>{mounted=false;observer.disconnect();};},[children]);
  return <div ref={ref} className={`fitted-text ${className}`}>{children}</div>;
}

function Discovery({topic,depth,preview=false,onSources}:{topic:Topic;depth:number;preview?:boolean;onSources:()=>void}){
  const level=topic.levels[depth-1];
  return <div className={`constellation layout-${(depth-1)%3} object-count-${level.objects.length} ${preview?'is-preview':''}`}>
    {level.objects.map((object,index)=><div key={object.id} className={`floating-anchor object-slot slot-${index} object-${object.type}`}>
      {object.type==='fact'?<article className="glass fact-card"><div className="card-heading"><Sparkles size={18}/><span>{String(index+1).padStart(2,'0')}</span></div><h2 className="object-title">{object.title}</h2><FittedText>{object.text}</FittedText><button className="fact-source" onClick={onSources} tabIndex={preview?-1:0}>{object.evidence==='hypothesis'?'Possible explanation':object.evidence==='disputed'?'Disputed':object.evidence==='experiment'?'Experimental evidence':'Sources'} <ArrowUpRight size={12}/></button></article>
      :object.type==='video'?<a className="glass media-card" href={`https://www.youtube.com/watch?v=${object.youtubeId}`} target="_blank" rel="noreferrer" tabIndex={preview?-1:0} title={`${object.channel}: ${object.note}`}><SafeImage src={`https://i.ytimg.com/vi/${object.youtubeId}/hqdefault.jpg`} alt={object.title}/><span className="youtube-label"><span><Play size={10} fill="currentColor"/></span> YouTube</span><span className="play-orb"><Play size={27} fill="currentColor"/></span><div className="media-caption"><strong>{object.title}</strong><span>{object.channel}</span></div></a>
      :object.type==='image'?<figure className="glass media-card photo-card"><SafeImage src={object.image.url} alt={object.image.alt}/><figcaption><span>{object.title}</span><p className="image-caption">{object.caption}</p><a href={object.image.sourceUrl} target="_blank" rel="noreferrer" tabIndex={preview?-1:0}>{object.image.credit} <ArrowUpRight size={11}/></a></figcaption></figure>
      :<a className="glass fact-card article-card" href={object.url} target="_blank" rel="noreferrer" tabIndex={preview?-1:0}><div className="card-heading"><BookOpen size={18}/><ArrowUpRight size={17}/></div><h2 className="object-title">{object.title}</h2><FittedText>{object.description}</FittedText><span className="card-footnote">{object.publisher}</span></a>}
    </div>)}
  </div>;
}

type Overlay='history'|'library'|'sources'|null;
type Flight={id:number;direction:'forward'|'backward';from:Place|null}|null;
function App(){
  const [started,setStarted]=useState(false);
  const [selectedTopic,setSelectedTopic]=useState<string|null>(null);
  const [journal,setJournal]=useState<Place[]>(()=>readPlaces('rh-history'));
  const [journey,setJourney]=useState<Journey>(()=>({current:parseHash(location.hash,topics)||{topicId:randomTopic(topics,readPlaces('rh-history').slice(-8).map(p=>p.topicId)).id,level:1},trail:[]}));
  const [overlay,setOverlay]=useState<Overlay>(null),[page,setPage]=useState(0),[notice,setNotice]=useState('');
  const [fullscreen,setFullscreen]=useState(!!document.fullscreenElement),[flight,setFlight]=useState<Flight>(null),[compact,setCompact]=useState(innerWidth<650||innerHeight<600);
  const flying=useRef(false),flightTimer=useRef<ReturnType<typeof setTimeout>|null>(null),dialog=useRef<HTMLDialogElement>(null),touch=useRef<{x:number;y:number}|null>(null);
  const current=journey.current,topic=topics.find(t=>t.id===current.topicId)!,level=topic.levels[current.level-1];
  const open=(next:Overlay)=>{setPage(0);setOverlay(next);};
  const travel=(next:Journey,direction:'forward'|'backward'='forward')=>{
    if(flying.current||(started&&same(current,next.current)))return;
    flying.current=true;setFlight({id:Date.now(),direction,from:started?current:null});setJourney(next);setStarted(true);setOverlay(null);
    flightTimer.current=setTimeout(()=>{flying.current=false;setFlight(null);},1550);
  };
  const go=(p:Place)=>travel(visit(journey,p));
  const deeper=()=>{if(started&&!level.final)go({...current,level:current.level+1});};
  const up=()=>{if(started)travel(back(journey),'backward');};
  const newHole=()=>{
    if(!started){
      const next=selectedTopic?topics.find(t=>t.id===selectedTopic)!:randomTopic(topics,journal.slice(-8).map(p=>p.topicId));
      travel({current:{topicId:next.id,level:1},trail:[]});
      setSelectedTopic(null);
    }else{
      const next=randomTopic(topics,journal.slice(-8).map(p=>p.topicId),current.topicId);
      go({topicId:next.id,level:1});
    }
  };
  const chooseTopic=(topicId:string)=>{
    if(started)go({topicId,level:1});
    else{setSelectedTopic(topicId);setJourney({current:{topicId,level:1},trail:[]});}
    setOverlay(null);
  };
  const toggleFullscreen=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{setNotice('Fullscreen is unavailable in this browser.');}};
  useEffect(()=>{
    if(!started){document.title='Welcome · Rabbit Hole';return;}
    history.replaceState(null,'',placeHash(current));document.title=`${level.title} · Rabbit Hole`;
    setJournal(items=>items.length&&same(items[items.length-1],current)?items:[...items,current].slice(-200));
  },[started,current.topicId,current.level]);
  useEffect(()=>save('rh-history',journal),[journal]);
  useEffect(()=>{const handler=()=>{const p=parseHash(location.hash,topics);if(p)setJourney(j=>same(j.current,p)?j:visit(j,p));};window.addEventListener('hashchange',handler);return()=>window.removeEventListener('hashchange',handler);},[]);
  useEffect(()=>{if(overlay)dialog.current?.showModal();else dialog.current?.close();},[overlay]);
  useEffect(()=>setPage(0),[compact]);
  useEffect(()=>{if(!notice)return;const timer=setTimeout(()=>setNotice(''),2800);return()=>clearTimeout(timer);},[notice]);
  useEffect(()=>{const handler=()=>setFullscreen(!!document.fullscreenElement),resize=()=>setCompact(innerWidth<650||innerHeight<600);document.addEventListener('fullscreenchange',handler);window.addEventListener('resize',resize);return()=>{document.removeEventListener('fullscreenchange',handler);window.removeEventListener('resize',resize);if(flightTimer.current)clearTimeout(flightTimer.current);};},[]);
  useEffect(()=>{const handler=(e:KeyboardEvent)=>{
    if(e.altKey||e.ctrlKey||e.metaKey||e.repeat)return;if(e.key==='Escape'){setOverlay(null);return;}if(overlay)return;
    const target=e.target as HTMLElement;if(target.closest('input,textarea,select,[contenteditable="true"]'))return;
    const actions:Record<string,()=>void>={ArrowUp:deeper,ArrowDown:up,h:()=>{if(started)open('history');},f:()=>void toggleFullscreen(),' ':newHole};
    const action=actions[e.key.length===1?e.key.toLowerCase():e.key];if(action){e.preventDefault();action();}
  };window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler);});
  const outgoingTopic=flight?.from?topics.find(t=>t.id===flight.from!.topicId)!:null;
  const historyItems=[...journal].reverse(),perPage=compact?3:5;
  const sourceItems=Array.from(new Map(level.objects.flatMap(object=>{
    if(object.type==='fact')return object.sources.map(s=>({title:s.title,by:s.publisher,url:s.url}));
    if(object.type==='video')return [{title:object.title,by:`${object.channel} · ${object.note}`,url:`https://www.youtube.com/watch?v=${object.youtubeId}`}];
    if(object.type==='image')return [{title:object.title,by:`${object.caption} · ${object.image.credit}`,url:object.image.sourceUrl}];
    return [{title:object.title,by:object.publisher,url:object.url}];
  }).map(source=>[source.url,source])).values());
  const totalPages=overlay==='history'?Math.ceil(historyItems.length/perPage):overlay==='library'?Math.ceil(topics.length/(compact?1:2)):overlay==='sources'?Math.ceil(sourceItems.length/(compact?2:4)):1;
  return <div className={`app ${!started?'at-welcome':''} ${flight?'in-flight':''}`}>
    <Space flight={flight?.id||0}/>
    <header className="topbar">
      {started&&<><button className="brand" onClick={()=>open('library')} aria-label="Rabbit Hole — browse"><span className="brand-orbit"/><span>RABBIT HOLE</span></button><div className="depth-indicator"><strong>{String(current.level).padStart(2,'0')}</strong><span>DEPTH</span></div></>}
      <nav aria-label="Main"><button onClick={()=>open('library')}>Explore</button><button onClick={newHole}>New Rabbit Hole</button></nav>
    </header>
    {!started?<main className="welcome-screen">
      <div className="welcome-logo" aria-label="Rabbit Hole"><span className="brand-orbit"/><span>RABBIT HOLE</span></div>
      <h1>Welcome.</h1>
      <div className="welcome-controls">
        <div><span className="welcome-keys"><kbd>↑</kbd><kbd>↓</kbd></span><span>Go deeper or back up</span></div>
        <div><kbd>Space</kbd><span>A new rabbit hole</span></div>
        <div><kbd>F</kbd><span>Fullscreen</span></div>
      </div>
      <button className="welcome-explore" onClick={()=>open('library')}>Use <strong>Explore</strong> to select a topic <ArrowUpRight size={14}/></button>
      {selectedTopic&&<p className="welcome-selection">{topic.title}</p>}
      <button className="welcome-begin" onClick={newHole}>Press <kbd>Space</kbd> to begin <ArrowUpRight size={16}/></button>
    </main>:<main className={`space-stage count-${level.objects.length}`} onTouchStart={e=>{if(!(e.target as HTMLElement).closest('button,a'))touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY};}} onTouchEnd={e=>{if(!touch.current)return;const dx=e.changedTouches[0].clientX-touch.current.x,dy=e.changedTouches[0].clientY-touch.current.y;touch.current=null;if(Math.max(Math.abs(dx),Math.abs(dy))<60)return;if(Math.abs(dy)>Math.abs(dx)){if(dy<0)deeper();else up();}}}>
      <div className="discovery-heading" key={`${topic.id}-${current.level}`} aria-live="polite"><h1>{level.title}</h1></div>
      <div className="perspective-space">
        {[2,1].map(offset=>{const depth=current.level+offset;return depth<=topic.levels.length?<div key={`distant-${topic.id}-${depth}`} className={`depth-plane distant distant-${offset}`} aria-hidden="true" inert><Discovery topic={topic} depth={depth} preview onSources={()=>{}}/></div>:null;})}
        <div className="orbital-path" aria-hidden="true">{[0,1,2,3,4,5].map(i=><i key={i} style={{'--ring':i} as React.CSSProperties}/>)}</div>
        {flight?.from&&outgoingTopic&&<div key={`out-${flight.id}`} className={`depth-plane departure departure-${flight.direction}`} aria-hidden="true" inert><Discovery topic={outgoingTopic} depth={flight.from.level} preview onSources={()=>{}}/></div>}
        <div key={`${topic.id}-${current.level}`} className={`depth-plane present ${flight?`arrival arrival-${flight.direction}`:''}`}><Discovery topic={topic} depth={current.level} onSources={()=>open('sources')}/></div>
      </div>
      <button className={`portal ${level.final?'at-bottom':''}`} onClick={level.final?newHole:deeper} disabled={!!flight} aria-label={level.final?'Start a new rabbit hole':'Go deeper'}><span className="portal-label">{level.final?'THE BOTTOM':'NEXT LEVEL'}<small>{level.final?'ANOTHER UNIVERSE AWAITS':'THERE’S MORE'}</small></span><span className="portal-line"/><span className="event-horizon"><span/></span></button>
    </main>}
    <footer className="hud">
      {started&&<><div className="utility-controls"><button aria-label="History" title="History (H)" onClick={()=>open('history')}><History size={16}/></button><button aria-label="Sources" title="Sources" onClick={()=>open('sources')}><BookOpen size={16}/></button></div><div className="depth-navigation"><div className="depth-buttons"><button onClick={deeper} disabled={level.final||!!flight} aria-label="Go deeper"><ArrowUp size={17}/></button><button onClick={up} disabled={(!journey.trail.length&&current.level===1)||!!flight} aria-label="Back up"><ArrowDown size={17}/></button></div><span>{level.final?'YOU’VE REACHED THE BOTTOM':'USE ↑ ↓ TO MOVE'}{!level.final&&<small>DEEPER OR CLOSER</small>}<small className="space-hint">PRESS SPACE FOR A NEW RABBIT HOLE</small></span></div></>}
      <div className="utility-controls right-tools"><button aria-label="Toggle fullscreen" title="Fullscreen (F)" onClick={()=>void toggleFullscreen()}>{fullscreen?<Minimize size={16}/>:<Maximize size={16}/>}</button></div>
    </footer>
    <dialog ref={dialog} className="overlay" aria-labelledby="overlay-title" onCancel={()=>setOverlay(null)} onClick={e=>{if(e.target===dialog.current)setOverlay(null);}}><div className="modal"><div className="modal-heading"><h2 id="overlay-title">{overlay==='history'?'Your trail':overlay==='library'?'Pick a rabbit hole':'Follow the evidence'}</h2><button className="icon-button" aria-label="Close" onClick={()=>setOverlay(null)}><X size={21}/></button></div>
      <div className="modal-content">{overlay==='library'?<div className="library">{topics.slice(page*(compact?1:2),(page+1)*(compact?1:2)).map(t=><button key={t.id} onClick={()=>chooseTopic(t.id)}><SafeImage src={t.image.url} alt={t.image.alt}/><div><span className="tiny-label">{t.category}</span><h3>{t.title}</h3><p>{t.hook}</p><span className="library-action">{started?'Enter':'Select'} <ArrowUpRight size={16}/></span></div></button>)}</div>:overlay==='sources'?<div className="source-list">{sourceItems.slice(page*(compact?2:4),(page+1)*(compact?2:4)).map(s=><a key={s.url} href={s.url} target="_blank" rel="noreferrer"><span><strong>{s.title}</strong><small>{s.by}</small></span><ArrowUpRight size={19}/></a>)}</div>:<div className="history-list">{!historyItems.length?<p className="empty">Your discoveries will appear here.</p>:historyItems.slice(page*perPage,(page+1)*perPage).map((p,i)=>{const t=topics.find(t=>t.id===p.topicId)!;return <button key={`${p.topicId}-${p.level}-${i}`} onClick={()=>{go(p);setOverlay(null);}}><span className="history-number">{String(p.level).padStart(2,'0')}</span><span><small>{t.category}</small><strong>{t.levels[p.level-1].title}</strong></span><ArrowUpRight size={18}/></button>;})}</div>}</div>
      {totalPages>1&&<div className="pagination"><button disabled={page===0} onClick={()=>setPage(p=>p-1)} aria-label="Previous page"><ChevronLeft size={18}/></button><span>{page+1} / {totalPages}</span><button disabled={page>=totalPages-1} onClick={()=>setPage(p=>p+1)} aria-label="Next page"><ChevronRight size={18}/></button></div>}
    </div></dialog><div className={`toast ${notice?'visible':''}`} role="status">{notice}</div>
  </div>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode>{topics.length?<App/>:<div className="fatal"><Compass/><h1>No discoveries found.</h1></div>}</React.StrictMode>);

