import { validateCollection } from './schema';
// Raw imports let the UI isolate malformed JSON instead of crashing Vite's JSON parser.
export const { topics, errors } = validateCollection(import.meta.glob('../topics/*.json', { eager: true, query: '?raw', import: 'default' }));
