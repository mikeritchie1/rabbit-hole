import { test } from 'node:test';
import assert from 'node:assert/strict';
import { discoveryObjectSchema } from '../src/schema';

test('experiments accept local HTML files and reject external or traversing paths',()=>{
  const object={type:'experiment',id:'bubble-lab',title:'Bubble lab',description:'Explore cavitation.',file:'diagrams/pistol-shrimp-cavitation-lab.html'};
  assert.equal(discoveryObjectSchema.safeParse(object).success,true);
  for(const file of ['../lab.html','diagrams/../lab.html','https://example.com/lab.html','diagrams/lab.js']){
    assert.equal(discoveryObjectSchema.safeParse({...object,file}).success,false,file);
  }
});
