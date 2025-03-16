import { Note, Category } from './interfaces';

export const categories: Category[] = [
  { id: '1', name: 'Personal' },
  { id: '2', name: 'Work' },
];

export let notes: Note[] = [
  {
    id: '1',
    title: 'Grocery List',
    content: 'Milk, eggs, bread',
    category: categories[0],
  },
  {
    id: '2',
    title: 'Project Meeting Notes',
    content: 'Discussed project timeline and deliverables',
    category: categories[1],
  },
];