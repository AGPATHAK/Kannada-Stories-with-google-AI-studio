export type StoryLevel = 'Beginner' | 'Early Reader' | 'Intermediate';

export interface PronunciationGuide {
  devanagari: string;
  latin?: string;
}

export interface StoryToken {
  text: string;
  startMs: number;
  endMs: number;
}

export interface StorySegment {
  id: string;
  kannada: string;
  english: string;
  tokens: StoryToken[];
  totalDurationMs: number;
  audioSrc?: string;
}

export interface VocabularyWord {
  word: string;
  meaning: string;
  pronunciation: string;
  pronunciationGuide?: PronunciationGuide;
  note?: string;
  partOfSpeech?: 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase';
  reviewKey?: string;
  tags?: string[];
}

export interface InlineGlossaryEntry {
  id: string;
  word: string;
  surfaceForms: string[];
  meaning: string;
  pronunciationGuide?: PronunciationGuide;
  note?: string;
  reviewKey?: string;
}

export interface ComprehensionQuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface ComprehensionQuestion {
  id: string;
  prompt: string;
  skill: 'detail' | 'sequence' | 'vocabulary' | 'main-idea' | 'moral';
  options: ComprehensionQuestionOption[];
  explanation?: string;
}

export interface Story {
  id: string;
  slug: string;
  title: string;
  sourceTitle: string;
  sourceLabel: string;
  level: StoryLevel;
  estimatedMinutes: number;
  summary: string;
  corpus?: string;
  themeTags?: string[];
  grammarFocus?: string[];
  segments: StorySegment[];
  inlineGlossary: InlineGlossaryEntry[];
  vocabulary: VocabularyWord[];
  comprehensionQuestions: ComprehensionQuestion[];
}
