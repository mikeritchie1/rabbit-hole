import type { Topic } from './schema';

export function depthImages(topic:Topic,depth:number):string[]{
  return [...new Set((topic.levels[depth-1]?.objects??[]).flatMap(object=>
    object.type==='image'?[object.image.url]:object.type==='video'?[`https://i.ytimg.com/vi/${object.youtubeId}/hqdefault.jpg`]:[]))];
}

// Limit parallel downloads so speculative images do not flood the connection.
export function createImagePreloader(load:(url:string)=>Promise<void>,concurrency=4){
  const pending=new Map<string,number>(),loaded=new Set<string>();
  const active=new Set<string>();
  const pump=()=>{
    while(active.size<concurrency&&pending.size){
      const [url]=[...pending].sort((a,b)=>b[1]-a[1])[0];
      pending.delete(url);active.add(url);
      void load(url).then(()=>{loaded.add(url);},()=>{}).finally(()=>{active.delete(url);pump();});
    }
  };
  return (urls:string[],priority=0)=>{
    for(const url of urls)if(!loaded.has(url)&&!active.has(url))pending.set(url,Math.max(priority,pending.get(url)??priority));
    pump();
  };
}
