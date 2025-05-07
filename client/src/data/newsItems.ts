import newsData from './news.json';

interface News {
  id: number;
  title: string;
  tag: string;
  date: string;
  content: string;
  imageUrl?: string;
}

export function getNewsById(id: number): News | null {
  return newsData.find(item => item.id === id) || null;
}

export function getAllNews(): News[] {
  return newsData;
}

export default newsData;