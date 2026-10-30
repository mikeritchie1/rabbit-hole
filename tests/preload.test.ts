import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createImagePreloader, depthImages } from '../src/preload';
import type { Topic } from '../src/schema';

const flush=()=>new Promise(resolve=>setImmediate(resolve));
test('depth preloading includes actual image and YouTube thumbnail URLs',()=>{
  const topic=JSON.parse(readFileSync('topics/messenger-pigeons.json','utf8')) as Topic;
  const expected=topic.levels[0].objects.flatMap(o=>o.type==='image'?[o.image.url]:o.type==='video'?[`https://i.ytimg.com/vi/${o.youtubeId}/hqdefault.jpg`]:[]);
  assert.deepEqual(depthImages(topic,1),[...new Set(expected)]);
  assert.deepEqual(depthImages(topic,999),[]);
});
test('preloads deduplicate, limit downloads and prioritise upcoming images',async()=>{
  const started:string[]=[];
  const finish:Array<()=>void>=[];
  const preload=createImagePreloader(url=>{started.push(url);return new Promise<void>(resolve=>finish.push(resolve));},1);
  preload(['active','background','active']);
  preload(['next-depth','background'],3);
  assert.deepEqual(started,['active']);
  finish.shift()!();await flush();
  assert.deepEqual(started,['active','background']);
  finish.shift()!();await flush();
  assert.deepEqual(started,['active','background','next-depth']);
  finish.shift()!();await flush();
  preload(['active','next-depth']);
  assert.equal(started.length,3);
});
test('a failed preload frees its slot and can be retried',async()=>{
  const started:string[]=[];
  const preload=createImagePreloader(async url=>{started.push(url);if(url==='broken')throw new Error('offline');},1);
  preload(['broken','good']);await flush();
  assert.deepEqual(started,['broken','good']);
  preload(['broken','good']);await flush();
  assert.deepEqual(started,['broken','good','broken']);
});
