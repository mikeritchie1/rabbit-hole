export const TOPIC_CATEGORIES = ['Explained', 'Unsolved', 'Mind-bending', 'Dark & disturbing'] as const;
export type TopicCategory = typeof TOPIC_CATEGORIES[number];
export type CategoryFilter = 'All' | TopicCategory;
export const CATEGORY_DESCRIPTIONS: Record<CategoryFilter,string> = {
  All: 'Explore every kind of surprise.',
  Explained: 'Something extraordinary with a scientifically established mechanism.',
  Unsolved: 'A genuine mystery with competing hypotheses.',
  'Mind-bending': 'A discovery that challenges ordinary intuition.',
  'Dark & disturbing': 'Parasites, disasters, gruesome history and strange behaviour.'
};
export function isCategoryFilter(value:unknown):value is CategoryFilter{
  return value==='All'||TOPIC_CATEGORIES.some(category=>category===value);
}
export function topicsInCategory<T extends {category:TopicCategory}>(topics:T[],category:CategoryFilter):T[]{
  return category==='All'?topics:topics.filter(topic=>topic.category===category);
}
