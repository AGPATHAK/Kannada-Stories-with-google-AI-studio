import { ContentType, LessonMode, SourceType } from '../types/story';

export interface ContentTypeDefinition {
  contentType: ContentType;
  label: string;
  supportedSourceTypes: SourceType[];
  supportedLessonModes: LessonMode[];
}

export const contentTypes: ContentTypeDefinition[] = [
  {
    contentType: 'story',
    label: 'Story',
    supportedSourceTypes: ['curated', 'literary', 'agentic'],
    supportedLessonModes: ['read-along', 'listening', 'gloss-first', 'comprehension'],
  },
  {
    contentType: 'poem',
    label: 'Poem',
    supportedSourceTypes: ['curated', 'literary'],
    supportedLessonModes: ['read-along', 'listening', 'comprehension'],
  },
  {
    contentType: 'headline',
    label: 'Headline',
    supportedSourceTypes: ['news', 'agentic'],
    supportedLessonModes: ['gloss-first', 'comprehension'],
  },
  {
    contentType: 'news-brief',
    label: 'News Brief',
    supportedSourceTypes: ['news', 'agentic'],
    supportedLessonModes: ['read-along', 'gloss-first', 'comprehension'],
  },
  {
    contentType: 'dialogue',
    label: 'Dialogue',
    supportedSourceTypes: ['curated', 'agentic'],
    supportedLessonModes: ['read-along', 'listening', 'comprehension'],
  },
];

export function getContentTypeDefinition(contentType: ContentType): ContentTypeDefinition | undefined {
  return contentTypes.find((entry) => entry.contentType === contentType);
}
