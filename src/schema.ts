import { z } from 'zod';
import { TOPIC_CATEGORIES } from './categories.ts';
const text = z.string().trim().min(1);
const url = z.string().url().refine(v => v.startsWith('https://'), 'Use an HTTPS URL');
const image = z.object({url, alt: text, credit: text, sourceUrl: url}).strict();
const source = z.object({title:text,publisher:text,url}).strict();
const evidence = z.enum(['documented','experiment','hypothesis','disputed']);
const objectId = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const discoveryObjectSchema = z.discriminatedUnion('type', [
  z.object({type:z.literal('fact'),id:objectId,title:text,text,evidence,sources:z.array(source).min(1)}).strict(),
  z.object({type:z.literal('image'),id:objectId,title:text,image,caption:text}).strict(),
  z.object({type:z.literal('video'),id:objectId,title:text,channel:text,youtubeId:z.string().regex(/^[\w-]{11}$/),note:text}).strict(),
  z.object({type:z.literal('article'),id:objectId,title:text,publisher:text,url,description:text}).strict()
]);
const tangent = z.object({topicId: text, level: z.number().int().min(1), label: text, reason: text}).strict().nullable();
export const topicSchema = z.object({
  schemaVersion: z.literal(2), id: objectId,
  title: text, category: z.enum(TOPIC_CATEGORIES), hook: text, image,
  levels: z.array(z.object({id: objectId, title: text, objects:z.array(discoveryObjectSchema).min(1).max(4),
    tangents:z.object({left:tangent,right:tangent}).strict().optional(), final:z.boolean()
  }).strict()).min(1)
}).strict().superRefine((topic,ctx)=>{
  if(new Set(topic.levels.map(l=>l.id)).size!==topic.levels.length) ctx.addIssue({code:'custom',message:'Level IDs must be unique'});
  topic.levels.forEach((l,i)=>{
    if(l.final!==(i===topic.levels.length-1))ctx.addIssue({code:'custom',path:['levels',i,'final'],message:'Only the last level must be final'});
    if(new Set(l.objects.map(o=>o.id)).size!==l.objects.length)ctx.addIssue({code:'custom',path:['levels',i,'objects'],message:'Object IDs must be unique within their level'});
  });
});
export type Topic = z.infer<typeof topicSchema>;
export type DiscoveryObject = z.infer<typeof discoveryObjectSchema>;
export type Tangent = NonNullable<NonNullable<Topic['levels'][number]['tangents']>['left']>;
export function validateCollection(files: Record<string,unknown>){
  const topics:Topic[]=[]; const errors:string[]=[];
  for(const [file,raw] of Object.entries(files)){
    let input=raw;
    if(typeof raw==='string'){try{input=JSON.parse(raw);}catch{errors.push(`${file}: invalid JSON`);continue;}}
    const result=topicSchema.safeParse(input);
    if(!result.success){errors.push(`${file}: ${result.error.issues.map(i=>`${i.path.join('.')}: ${i.message}`).join('; ')}`);continue;}
    if(topics.some(t=>t.id===result.data.id)){errors.push(`${file}: duplicate topic ID ${result.data.id}`);continue;}
    topics.push(result.data);
  }
  for(const topic of topics) for(const level of topic.levels) for(const side of ['left','right'] as const){
    const link=level.tangents?.[side];if(!link)continue;
    const target=topics.find(t=>t.id===link.topicId);
    if(!target||!target.levels[link.level-1]){errors.push(`${topic.id}/${level.id}: broken ${side} tangent ${link.topicId}:${link.level}`);level.tangents![side]=null;}
  }
  return {topics,errors};
}
