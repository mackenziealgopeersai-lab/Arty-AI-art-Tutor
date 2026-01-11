
import { Lesson } from './types';

export const COLORS = [
  '#000000', '#475569', '#94a3b8', '#ffffff',
  '#ef4444', '#f97316', '#f59e0b', '#eab308',
  '#84cc16', '#22c55e', '#10b981', '#06b6d4',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
  '#d946ef', '#ec4899', '#f43f5e', '#78350f'
];

export const INITIAL_LESSONS: Lesson[] = [
  {
    id: '1',
    title: 'Dynamic Line Weight',
    description: 'Learn how varying your line thickness can add energy and depth to a simple sketch.',
    objective: 'Draw a character using thick lines for shadows and thin lines for details.'
  },
  {
    id: '2',
    title: 'Primary Color Pop',
    description: 'Explore high-contrast palettes using only Red, Blue, and Yellow.',
    objective: 'Create a landscape using only three primary colors.'
  },
  {
    id: '3',
    title: 'The Power of Negative Space',
    description: 'Focus on the shapes around an object rather than the object itself.',
    objective: 'Draw a chair by only painting the background around it.'
  }
];
