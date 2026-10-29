import type { Topic } from './schema';
export type Place={topicId:string;level:number};
export type Journey={current:Place;trail:Place[];ahead:Place[]};
// Insert after the current topic without discarding topics to its right.
export function insertTopic(journey:Journey,place:Place):Journey{
  return {current:place,trail:[...journey.trail,journey.current],ahead:journey.ahead};
}
export function visit(journey:Journey,place:Place):Journey{
  return place.topicId===journey.current.topicId?{...journey,current:place}:insertTopic(journey,place);
}
export function back(journey:Journey):Journey{
  return journey.current.level>1?{...journey,current:{...journey.current,level:journey.current.level-1}}:journey;
}
export function previousTopic(journey:Journey):Journey{
  if(!journey.trail.length)return journey;
  return {current:journey.trail[journey.trail.length-1],trail:journey.trail.slice(0,-1),ahead:[journey.current,...journey.ahead]};
}
export function nextTopic(journey:Journey):Journey{
  if(!journey.ahead.length)return journey;
  return {current:journey.ahead[0],trail:[...journey.trail,journey.current],ahead:journey.ahead.slice(1)};
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
