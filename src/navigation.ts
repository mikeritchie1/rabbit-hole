import type { Topic } from './schema';
export type Place={topicId:string;level:number};
export type Journey={current:Place;trail:Place[]};
export function visit(journey:Journey,place:Place):Journey{return {current:place,trail:[...journey.trail,journey.current].slice(-200)};}
export function back(journey:Journey):Journey{
  if(journey.trail.length)return {current:journey.trail[journey.trail.length-1],trail:journey.trail.slice(0,-1)};
  return journey.current.level>1?{...journey,current:{...journey.current,level:journey.current.level-1}}:journey;
}
export function randomTopic(topics:Topic[],recent:string[],current?:string){
  const others=topics.filter(t=>t.id!==current);
  const fresh=others.filter(t=>!recent.includes(t.id));
  return (fresh.length?fresh:others.length?others:topics)[Math.floor(Math.random()*(fresh.length||others.length||topics.length))];
}
export function parseHash(hash:string,topics:Topic[]):Place|null{
  const params=new URLSearchParams(hash.replace(/^#/,''));const topic=topics.find(t=>t.id===params.get('topic'));
  const level=Number(params.get('level')||1);
  return topic&&Number.isInteger(level)&&level>=1&&level<=topic.levels.length?{topicId:topic.id,level}:null;
}
export function placeHash(p:Place){return `#topic=${encodeURIComponent(p.topicId)}&level=${p.level}`;}
