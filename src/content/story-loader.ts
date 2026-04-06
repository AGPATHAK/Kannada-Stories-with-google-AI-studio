import { getContentTypeDefinition } from './content-registry';
import { buildSegment } from './story-helpers';
import { Story, StoryManifest } from '../types/story';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function validateManifest(manifest: StoryManifest): void {
  assert(manifest.id.trim().length > 0, 'Story manifest is missing id.');
  assert(manifest.slug.trim().length > 0, 'Story manifest is missing slug.');
  assert(manifest.title.trim().length > 0, `Story "${manifest.id}" is missing title.`);
  assert(manifest.segments.length > 0, `Story "${manifest.id}" must include at least one segment.`);
  assert(manifest.vocabulary.length > 0, `Story "${manifest.id}" must include at least one vocabulary item.`);
  assert(
    manifest.comprehensionQuestions.length > 0,
    `Story "${manifest.id}" must include at least one comprehension question.`,
  );

  const contentTypeDefinition = getContentTypeDefinition(manifest.contentType);
  assert(contentTypeDefinition, `Story "${manifest.id}" has unsupported content type "${manifest.contentType}".`);
  assert(
    contentTypeDefinition.supportedSourceTypes.includes(manifest.sourceType),
    `Story "${manifest.id}" uses unsupported source type "${manifest.sourceType}" for content type "${manifest.contentType}".`,
  );
  assert(
    contentTypeDefinition.supportedLessonModes.includes(manifest.lessonMode),
    `Story "${manifest.id}" uses unsupported lesson mode "${manifest.lessonMode}" for content type "${manifest.contentType}".`,
  );

  manifest.segments.forEach((segment, index) => {
    assert(segment.id.trim().length > 0, `Story "${manifest.id}" segment ${index + 1} is missing id.`);
    assert(segment.kannada.trim().length > 0, `Story "${manifest.id}" segment "${segment.id}" is missing Kannada text.`);
    assert(segment.english.trim().length > 0, `Story "${manifest.id}" segment "${segment.id}" is missing English text.`);
  });

  const glossaryIds = new Set<string>();
  manifest.inlineGlossary.forEach((entry) => {
    assert(entry.surfaceForms.length > 0, `Story "${manifest.id}" glossary entry "${entry.id}" must include surface forms.`);
    assert(entry.word.trim().length > 0, `Story "${manifest.id}" glossary entry "${entry.id}" is missing word.`);
    assert(!glossaryIds.has(entry.id), `Story "${manifest.id}" glossary entry "${entry.id}" is duplicated.`);
    glossaryIds.add(entry.id);
  });

  manifest.comprehensionQuestions.forEach((question) => {
    const correctOptions = question.options.filter((option) => option.isCorrect);
    assert(
      question.options.length >= 2,
      `Story "${manifest.id}" question "${question.id}" must include at least two options.`,
    );
    assert(
      correctOptions.length === 1,
      `Story "${manifest.id}" question "${question.id}" must include exactly one correct option.`,
    );
  });

  const questionIds = new Set<string>();
  manifest.comprehensionQuestions.forEach((question) => {
    assert(!questionIds.has(question.id), `Story "${manifest.id}" question "${question.id}" is duplicated.`);
    questionIds.add(question.id);
  });
}

export function loadStoryFromManifest(manifest: StoryManifest): Story {
  validateManifest(manifest);

  return {
    ...manifest,
    segments: manifest.segments.map((segment) => ({
      ...buildSegment(segment.id, segment.kannada, segment.english, segment.baseDurationMs),
      audioSrc: segment.audioSrc,
    })),
  };
}
