import { get, set, update } from 'idb-keyval';
import { Story } from './gemini';

const STORIES_KEY = 'kannada_kali_stories';

export async function getStories(): Promise<Story[]> {
  const stories = await get<Story[]>(STORIES_KEY);
  return stories || [];
}

export async function saveStory(story: Story): Promise<void> {
  await update<Story[]>(STORIES_KEY, (val) => {
    const stories = val || [];
    // Check if story already exists
    const index = stories.findIndex(s => s.id === story.id);
    if (index > -1) {
      stories[index] = story;
    } else {
      stories.push(story);
    }
    return stories;
  });
}

export async function deleteStory(id: string): Promise<void> {
  await update<Story[]>(STORIES_KEY, (val) => {
    const stories = val || [];
    return stories.filter(s => s.id !== id);
  });
}

export async function clearStories(): Promise<void> {
  await set(STORIES_KEY, []);
}
