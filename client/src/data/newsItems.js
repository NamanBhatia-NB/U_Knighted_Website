import newsData from './news.json';

export function getNewsById(id) {
  return newsData.find(item => item.id === parseInt(id)) || null;
}

export function getAllNews() {
  return newsData;
}

export default newsData;