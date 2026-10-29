import { readFileSync, readdirSync } from 'node:fs';
import { validateCollection } from '../src/schema';
const files=Object.fromEntries(readdirSync('topics').filter(f=>f.endsWith('.json')).map(f=>[f,readFileSync(`topics/${f}`,'utf8')]));
const {topics,errors}=validateCollection(files);
if(!topics.length)errors.push('No valid topics found');
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log(`Validated ${topics.length} topics, ${topics.reduce((n,t)=>n+t.levels.length,0)} levels, and all tangent targets.`);
