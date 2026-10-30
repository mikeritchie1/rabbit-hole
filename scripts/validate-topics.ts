import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { validateCollection } from '../src/schema';
const files=Object.fromEntries(readdirSync('topics').filter(f=>f.endsWith('.json')).map(f=>[f,readFileSync(`topics/${f}`,'utf8')]));
const {topics,errors}=validateCollection(files);
for(const topic of topics)for(const level of topic.levels)for(const object of level.objects){
  if(object.type==='experiment'&&!existsSync(object.file))errors.push(`${topic.id}/${level.id}: missing experiment ${object.file}`);
  if(object.type==='image'&&object.image.url.startsWith('diagrams/')&&!existsSync(object.image.url))errors.push(`${topic.id}/${level.id}: missing diagram ${object.image.url}`);
}
if(!topics.length)errors.push('No valid topics found');
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log(`Validated ${topics.length} topics, ${topics.reduce((n,t)=>n+t.levels.length,0)} levels, and all tangent targets.`);
