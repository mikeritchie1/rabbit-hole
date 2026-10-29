import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Maximize, Minimize, X, ArrowUpRight, Play, Compass, Orbit, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { topics } from './data';
import { back, previousTopic, nextTopic, insertTopic, visit, randomTopic, parseHash, placeHash, type Journey, type Place } from './navigation';
import type { Topic } from './schema';
import { Space, type SpaceMotion } from './Space';
import { TOPIC_CATEGORIES, CATEGORY_DESCRIPTIONS, isCategoryFilter, topicsInCategory, type CategoryFilter } from './categories';
import './styles.css';

function readPlaces(key:string):Place[]{try{const raw=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(raw)?raw.filter(p=>p&&topics.some(t=>t.id===p.topicId&&Number.isInteger(p.level)&&p.level>=1&&p.level<=t.levels.length)).slice(-200):[];}catch{return [];}}
function save(key:string,value:unknown){try{localStorage.setItem(key,JSON.stringify(value));}catch{}}
function readCategory():CategoryFilter{try{const value=JSON.parse(localStorage.getItem('rh-category')||'"All"');return isCategoryFilter(value)?value:'All';}catch{return 'All';}}
const same=(a:Place,b:Place)=>a.topicId===b.topicId&&a.level===b.level;
function SafeImage({src,alt}:{src:string;alt:string}){
  const [failed,setFailed]=useState(false);
  const image=useRef<HTMLImageElement>(null);
  useEffect(()=>setFailed(false),[src]);
  useLayoutEffect(()=>{
    const img=image.current,card=img?.closest<HTMLElement>('.media-card'),slot=card?.parentElement;
    if(!img||!card||!slot)return;
    const fit=()=>{
      if(!img.naturalWidth||!img.naturalHeight)return;
      slot.classList.toggle('portrait-media',img.naturalHeight>img.naturalWidth);
      const visual=img.parentElement!;
      visual.style.aspectRatio=img.naturalWidth+'/'+img.naturalHeight;
      card.style.height='auto';
      // Reserve room for tilted corners and floating movement.
      const margin=slot.clientWidth<240?16:40;
      const maximum=Math.max(1,slot.clientWidth-margin),height=Math.max(1,slot.clientHeight-28);
      if(!maximum||!height)return;
      const caption=card.querySelector<HTMLElement>('.media-caption,figcaption');
      const captionSpace=Math.min(110,height*.4);
      if(caption){caption.style.maxHeight=captionSpace+'px';caption.style.overflow='hidden';}
      const scale=Math.min(maximum/img.naturalWidth,Math.max(1,height-captionSpace-2)/img.naturalHeight);
      card.style.width=Math.floor(img.naturalWidth*scale)+'px';
      card.style.maxHeight=height+'px';
    };
    let mounted=true;const observer=new ResizeObserver(fit);observer.observe(slot);img.addEventListener('load',fit);fit();void document.fonts.ready.then(()=>{if(mounted)fit();});
    return()=>{mounted=false;observer.disconnect();img.removeEventListener('load',fit);};
  },[src,failed]);
  return failed?<div className="image-fallback" role="img" aria-label={alt}><Orbit size={48}/></div>:<img ref={image} src={src} alt={alt} draggable={false} onError={()=>setFailed(true)}/>;
}

function FittedText({children,className=''}:{children:React.ReactNode;className?:string}){
  const ref=useRef<HTMLDivElement>(null);
  useLayoutEffect(()=>{const el=ref.current!;let mounted=true;const fit=()=>{if(!mounted)return;el.style.fontSize='';let size=parseFloat(getComputedStyle(el).fontSize);while(el.scrollHeight>el.clientHeight+1&&size>9){size-=.5;el.style.fontSize=`${size}px`;}};const observer=new ResizeObserver(fit);observer.observe(el);void document.fonts.ready.then(fit);fit();return()=>{mounted=false;observer.disconnect();};},[children]);
  return <div ref={ref} className={`fitted-text ${className}`}>{children}</div>;
}

function Discovery({topic,depth,preview=false,onSources}:{topic:Topic;depth:number;preview?:boolean;onSources:()=>void}){
  const level=topic.levels[depth-1];
  const featured=level.objects.findIndex(object=>object.type==='video');
  const featureIndex=featured>=0?featured:level.objects.findIndex(object=>object.type==='image');
  return <div className={`constellation layout-${(depth-1)%3} object-count-${level.objects.length} ${preview?'is-preview':''}`}>
    {level.objects.map((object,index)=><div key={object.id} className={`floating-anchor object-slot slot-${index} object-${object.type} ${index===featureIndex?'featured-media':`companion-${index<featureIndex?index:index-1}`}`}>
      {object.type==='fact'?<article className="glass fact-card"><button className="source-icon" onClick={onSources} tabIndex={preview?-1:0} aria-label="View sources" title="View sources"><ExternalLink size={15}/></button><h2 className="object-title">{object.title}</h2><FittedText>{object.text}</FittedText></article>
      :object.type==='video'?<a className="glass media-card" href={`https://www.youtube.com/watch?v=${object.youtubeId}`} target="_blank" rel="noreferrer" tabIndex={preview?-1:0} title={object.note}><div className="media-visual"><SafeImage src={`https://i.ytimg.com/vi/${object.youtubeId}/hqdefault.jpg`} alt={object.title}/><span className="play-orb"><Play size={27} fill="currentColor"/></span></div><div className="media-caption"><strong>{object.title}</strong><span>{object.channel}</span></div></a>
      :object.type==='image'?<figure className="glass media-card photo-card"><div className="media-visual"><SafeImage src={object.image.url} alt={object.image.alt}/></div><figcaption><span>{object.title}</span><p className="image-caption">{object.caption}</p></figcaption></figure>
      :<a className="glass fact-card article-card" href={object.url} target="_blank" rel="noreferrer" tabIndex={preview?-1:0}><span className="source-icon" aria-label="Open source"><ExternalLink size={15}/></span><h2 className="object-title">{object.title}</h2><FittedText>{object.description}</FittedText><span className="card-footnote">{object.publisher}</span></a>}
    </div>)}
  </div>;
}

type Overlay='library'|'sources'|null;
type Flight={id:number;direction:SpaceMotion;from:Place|null;departureStyle?:React.CSSProperties;headingStyle?:React.CSSProperties}|null;
function App(){
  const [started,setStarted]=useState(false);
  const [category,setCategory]=useState<CategoryFilter>(readCategory);
  const [journal,setJournal]=useState<Place[]>(()=>readPlaces('rh-history'));
  const [journey,setJourney]=useState<Journey>(()=>({current:parseHash(location.hash,topics)||{topicId:randomTopic(topics,readPlaces('rh-history').slice(-8).map(p=>p.topicId)).id,level:1},trail:[],ahead:[]}));
  const [overlay,setOverlay]=useState<Overlay>(null),[page,setPage]=useState(0),[notice,setNotice]=useState('');
  const [fullscreen,setFullscreen]=useState(!!document.fullscreenElement),[flight,setFlight]=useState<Flight>(null),[compact,setCompact]=useState(innerWidth<650||innerHeight<600);
  const flightSequence=useRef(0),flightTimer=useRef<ReturnType<typeof setTimeout>|null>(null),dialog=useRef<HTMLDialogElement>(null),touch=useRef<{x:number;y:number}|null>(null);
  const present=useRef<HTMLDivElement>(null),heading=useRef<HTMLDivElement>(null),journeyRef=useRef(journey),startedRef=useRef(started),hasExplored=useRef(false);
  const seenTopics=useRef(new Set<string>());
  journeyRef.current=journey;startedRef.current=started;
  const current=journey.current,topic=topics.find(t=>t.id===current.topicId)!,level=topic.levels[current.level-1];
  const open=(next:Overlay)=>{setPage(0);setOverlay(next);};
  const welcome=()=>{
    if(flightTimer.current)clearTimeout(flightTimer.current);
    startedRef.current=false;setFlight(null);setStarted(false);setOverlay(null);
    history.replaceState(null,'',location.pathname+location.search);
  };
  const travel=(next:Journey,direction:'forward'|'backward'='forward',restart=false)=>{
    const previous=journeyRef.current;
    if(!restart&&startedRef.current&&same(previous.current,next.current))return;
    if(flightTimer.current)clearTimeout(flightTimer.current);
    // Continue the departing scene from its visible position if a flight is interrupted.
    const visual=present.current?getComputedStyle(present.current):null;
    const departureStyle=visual?{'--departure-transform':visual.transform,'--departure-opacity':visual.opacity,'--departure-filter':visual.filter} as React.CSSProperties:undefined;
    const headingVisual=heading.current?getComputedStyle(heading.current):null;
    const headingStyle=headingVisual?{'--heading-transform':headingVisual.transform,'--heading-opacity':headingVisual.opacity} as React.CSSProperties:undefined;
    const switchingTopic=startedRef.current&&(previous.current.topicId!==next.current.topicId||restart);
    const motion:SpaceMotion=switchingTopic?(direction==='backward'?'orbit-left':'orbit-right'):direction;
    const id=++flightSequence.current;
    setFlight({id,direction:motion,from:startedRef.current?previous.current:null,departureStyle,headingStyle});
    seenTopics.current.add(next.current.topicId);
    journeyRef.current=next;startedRef.current=true;hasExplored.current=true;setJourney(next);setStarted(true);setOverlay(null);
    flightTimer.current=setTimeout(()=>setFlight(active=>active?.id===id?null:active),switchingTopic?1800:1550);
  };
  const go=(p:Place)=>travel(visit(journeyRef.current,p));
  const deeper=()=>{const place=journeyRef.current.current;const target=topics.find(t=>t.id===place.topicId)!;if(startedRef.current&&place.level<target.levels.length)go({...place,level:place.level+1});};
  const up=()=>{if(startedRef.current)travel(back(journeyRef.current),'backward');};
  const previousHole=()=>{if(!startedRef.current)return;const next=previousTopic(journeyRef.current);if(next!==journeyRef.current)travel(next,'backward',true);};
  const nextHole=()=>{if(!startedRef.current)return;const next=nextTopic(journeyRef.current);if(next!==journeyRef.current)travel(next,'forward',true);};
  const startRandom=(filter:CategoryFilter)=>{
    const pool=topicsInCategory(topics,filter).filter(t=>!seenTopics.current.has(t.id));
    if(!pool.length){setNotice(filter==='All'?'There are no more rabbit holes.':'There are no more rabbit holes in this category.');return;}
    const next=randomTopic(pool,journal.slice(-8).map(p=>p.topicId),startedRef.current?journeyRef.current.current.topicId:undefined);
    const place={topicId:next.id,level:1};
    travel(hasExplored.current?insertTopic(journeyRef.current,place):{current:place,trail:[],ahead:[]},'forward',true);
  };
  const newHole=()=>startRandom(category);
  const chooseCategory=(filter:CategoryFilter)=>{
    if(!topicsInCategory(topics,filter).length)return;
    setCategory(filter);setPage(0);
  };
  const chooseTopic=(topicId:string)=>{
    if(hasExplored.current)travel(insertTopic(journeyRef.current,{topicId,level:1}),'forward',true);
    else travel({current:{topicId,level:1},trail:[],ahead:[]});
    setOverlay(null);
  };
  const toggleFullscreen=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{setNotice('Fullscreen is unavailable in this browser.');}};
  useEffect(()=>{
    if(!started){document.title='Welcome · Rabbit Hole';return;}
    seenTopics.current.add(current.topicId);
    history.replaceState(null,'',placeHash(current));document.title=`${level.title} · Rabbit Hole`;
    setJournal(items=>items.length&&same(items[items.length-1],current)?items:[...items,current].slice(-200));
  },[started,current.topicId,current.level]);
  useEffect(()=>save('rh-history',journal),[journal]);
  useEffect(()=>save('rh-category',category),[category]);
  useEffect(()=>{const handler=()=>{const p=parseHash(location.hash,topics);if(p)setJourney(j=>same(j.current,p)?j:visit(j,p));};window.addEventListener('hashchange',handler);return()=>window.removeEventListener('hashchange',handler);},[]);
  useEffect(()=>{if(overlay)dialog.current?.showModal();else dialog.current?.close();},[overlay]);
  useEffect(()=>setPage(0),[compact]);
  useEffect(()=>{if(!notice)return;const timer=setTimeout(()=>setNotice(''),2800);return()=>clearTimeout(timer);},[notice]);
  useEffect(()=>{const handler=()=>setFullscreen(!!document.fullscreenElement),resize=()=>setCompact(innerWidth<650||innerHeight<600);document.addEventListener('fullscreenchange',handler);window.addEventListener('resize',resize);return()=>{document.removeEventListener('fullscreenchange',handler);window.removeEventListener('resize',resize);if(flightTimer.current)clearTimeout(flightTimer.current);};},[]);
  useEffect(()=>{const handler=(e:KeyboardEvent)=>{
    if(e.altKey||e.ctrlKey||e.metaKey||e.repeat)return;if(e.key==='Escape'){setOverlay(null);return;}if(overlay)return;
    const target=e.target as HTMLElement;if(target.closest('input,textarea,select,[contenteditable="true"]'))return;
    const actions:Record<string,()=>void>={ArrowUp:deeper,ArrowDown:up,ArrowLeft:previousHole,ArrowRight:nextHole,f:()=>void toggleFullscreen(),' ':newHole};
    const action=actions[e.key.length===1?e.key.toLowerCase():e.key];if(action){e.preventDefault();action();}
  };window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler);});
  const outgoingTopic=flight?.from?topics.find(t=>t.id===flight.from!.topicId)!:null;
  const orbiting=flight?.direction==='orbit-right'||flight?.direction==='orbit-left';
  const sourceItems=Array.from(new Map(level.objects.flatMap(object=>{
    if(object.type==='fact')return object.sources.map(s=>({title:s.title,by:s.publisher,url:s.url}));
    if(object.type==='video')return [{title:object.title,by:`${object.channel} · ${object.note}`,url:`https://www.youtube.com/watch?v=${object.youtubeId}`}];
    if(object.type==='image')return [{title:object.title,by:`${object.caption} · ${object.image.credit}`,url:object.image.sourceUrl}];
    return [{title:object.title,by:object.publisher,url:object.url}];
  }).map(source=>[source.url,source])).values());
  const libraryTopics=topicsInCategory(topics,category);
  const totalPages=overlay==='library'?Math.ceil(libraryTopics.length/6):overlay==='sources'?Math.ceil(sourceItems.length/(compact?2:4)):1;
  return <div className={`app ${!started?'at-welcome':''} ${flight?'in-flight':''} ${orbiting?'orbit-turn':''}`}>
    <Space flight={flight?.id||0} motion={flight?.direction}/>
    <header className="topbar">
      {started&&<><button className="brand" onClick={welcome} aria-label="Rabbit Hole — return to welcome"><span className="brand-orbit"/><span>RABBIT HOLE</span></button><div className="depth-indicator"><strong>{String(current.level).padStart(2,'0')}</strong><span>DEPTH</span><small className="current-topic-title">{topic.title}<span className="current-category-label" data-category={topic.category}>{topic.category}</span></small></div></>}
      <nav aria-label="Main"><button onClick={()=>open('library')}>Explore</button><button onClick={newHole} title={`New rabbit hole: ${category}`}>New Rabbit Hole</button><button className="icon-button fullscreen-control" aria-label="Toggle fullscreen" title="Fullscreen (F)" onClick={()=>void toggleFullscreen()}>{fullscreen?<Minimize size={16}/>:<Maximize size={16}/>}</button></nav>
    </header>
    {!started?<main className="welcome-screen">
      <div className="welcome-logo" aria-label="Rabbit Hole"><span className="brand-orbit"/><span>RABBIT HOLE</span></div>
      <h1>Welcome.</h1>
      <div className="welcome-controls">
        <p>PRESS ↑ TO GO DEEPER</p>
        <p>PRESS ↓ TO GO BACK</p>
        <p>PRESS SPACE FOR A NEW RABBIT HOLE</p>
        <p>PRESS ← / → FOR PREVIOUS / NEXT RABBIT HOLE</p>
        <p>PRESS F FOR FULLSCREEN</p>
      </div>
      <button className="welcome-explore" onClick={()=>open('library')}>USE EXPLORE TO SELECT A TOPIC</button>
      <button className="welcome-begin" onClick={newHole}>PRESS SPACE TO BEGIN</button>
    </main>:<main className={`space-stage count-${level.objects.length}`} onTouchStart={e=>{if(!(e.target as HTMLElement).closest('button,a'))touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY};}} onTouchEnd={e=>{if(!touch.current)return;const dx=e.changedTouches[0].clientX-touch.current.x,dy=e.changedTouches[0].clientY-touch.current.y;touch.current=null;if(Math.max(Math.abs(dx),Math.abs(dy))<60)return;if(Math.abs(dy)>Math.abs(dx)){if(dy<0)deeper();else up();}else{if(dx<0)nextHole();else previousHole();}}}>
      {orbiting&&flight?.from&&outgoingTopic&&<div className={`discovery-heading heading-departure-${flight.direction}`} key={`heading-out-${flight.id}`} style={flight.headingStyle} aria-hidden="true"><h1>{outgoingTopic.levels[flight.from.level-1].title}</h1></div>}
      <div ref={heading} className={`discovery-heading ${orbiting?`heading-arrival-${flight.direction}`:''}`} key={`${topic.id}-${current.level}-${flightSequence.current}`} aria-live="polite"><h1>{level.title}</h1></div>
      <div className="perspective-space">
        {[1].map(offset=>{const depth=current.level+offset;return depth<=topic.levels.length?<div key={`distant-${topic.id}-${depth}`} className={`depth-plane distant distant-${offset} ${flight?.direction==='backward'?'return-preview':''}`} aria-hidden="true" inert><Discovery topic={topic} depth={depth} preview onSources={()=>{}}/></div>:null;})}
        <div className="orbital-path" aria-hidden="true">{[0,1,2,3,4,5].map(i=><i key={i} style={{'--ring':i} as React.CSSProperties}/>)}</div>
        {flight?.from&&outgoingTopic&&<div key={`out-${flight.id}`} style={flight.departureStyle} className={`depth-plane departure departure-${flight.direction}`} aria-hidden="true" inert><Discovery topic={outgoingTopic} depth={flight.from.level} preview onSources={()=>{}}/></div>}
        <div ref={present} key={`${topic.id}-${current.level}-${flightSequence.current}`} className={`depth-plane present ${flight?`arrival arrival-${flight.direction}`:''}`}><Discovery topic={topic} depth={current.level} onSources={()=>open('sources')}/></div>
      </div>
      <button className={`portal ${level.final?'at-bottom':''}`} onClick={level.final?newHole:deeper} aria-label={level.final?'Start a new rabbit hole':'Go deeper'}><span className="event-horizon"><span/></span></button>
    </main>}
    <footer className="hud">
      {started&&<div className="depth-navigation"><div className="navigation-buttons"><button className="topic-nav-button" onClick={previousHole} disabled={!journey.trail.length} aria-label="Previous rabbit hole" title="Previous rabbit hole (←)"><ArrowLeft size={16}/></button><div className="depth-buttons"><button onClick={deeper} disabled={level.final} aria-label="Go deeper"><ArrowUp size={17}/></button><button onClick={up} disabled={current.level===1} aria-label="Back up"><ArrowDown size={17}/></button></div><button className="topic-nav-button" onClick={nextHole} disabled={!journey.ahead.length} aria-label="Next existing rabbit hole" title="Next rabbit hole (→)"><ArrowRight size={16}/></button></div><span>{level.final?'YOU’VE REACHED THE BOTTOM':'USE ↑ ↓ TO MOVE'}{!level.final&&<small>DEEPER OR CLOSER</small>}<small className="space-hint">PRESS SPACE FOR A NEW RABBIT HOLE</small><small className="space-hint">PRESS ← / → FOR PREVIOUS / NEXT RABBIT HOLE</small></span></div>}
    </footer>
    <dialog ref={dialog} className={`overlay ${overlay==='library'?'explore-overlay':''}`} aria-labelledby="overlay-title" onCancel={()=>setOverlay(null)} onClick={e=>{if(e.target===dialog.current)setOverlay(null);}}><div className="modal"><div className="modal-heading"><h2 id="overlay-title">{overlay==='library'?'Pick a rabbit hole':'Follow the evidence'}</h2><button className="icon-button" aria-label="Close" onClick={()=>setOverlay(null)}><X size={21}/></button></div>
      {overlay==='library'&&<div className="category-filters" role="group" aria-label="Choose a surprise category">{(['All',...TOPIC_CATEGORIES] as const).map(filter=><button key={filter} data-category={filter} aria-pressed={category===filter} disabled={!topicsInCategory(topics,filter).length} title={CATEGORY_DESCRIPTIONS[filter]} onClick={()=>chooseCategory(filter)}>{filter}</button>)}<button className="start-category" onClick={()=>startRandom(category)} disabled={!libraryTopics.length} title={`Start a random rabbit hole: ${category}`}>Start rabbit hole in category <ArrowUpRight size={14}/></button></div>}
      <div className="modal-content">{overlay==='library'?<div className="library">{libraryTopics.slice(page*6,(page+1)*6).map(t=><button key={t.id} onClick={()=>chooseTopic(t.id)}><SafeImage src={t.image.url} alt={t.image.alt}/><div><span className="topic-category" data-category={t.category}>{t.category}</span><h3>{t.title}</h3><p>{t.hook}</p><span className="library-action">Enter <ArrowUpRight size={16}/></span></div></button>)}</div>:<div className="source-list">{sourceItems.slice(page*(compact?2:4),(page+1)*(compact?2:4)).map(s=><a key={s.url} href={s.url} target="_blank" rel="noreferrer"><span><strong>{s.title}</strong><small>{s.by}</small></span><ArrowUpRight size={19}/></a>)}</div>}</div>
      {totalPages>1&&<div className="pagination"><button disabled={page===0} onClick={()=>setPage(p=>p-1)} aria-label="Previous page"><ChevronLeft size={18}/></button><span>{page+1} / {totalPages}</span><button disabled={page>=totalPages-1} onClick={()=>setPage(p=>p+1)} aria-label="Next page"><ChevronRight size={18}/></button></div>}
    </div>{overlay&&<div className={`toast ${notice?'visible':''} ${notice.startsWith('There are no more rabbit holes')?'exhausted-notice':''}`} role="status">{notice}</div>}</dialog>{!overlay&&<div className={`toast ${notice?'visible':''} ${notice.startsWith('There are no more rabbit holes')?'exhausted-notice':''}`} role="status">{notice}</div>}
  </div>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode>{topics.length?<App/>:<div className="fatal"><Compass/><h1>No discoveries found.</h1></div>}</React.StrictMode>);

