import { NewsArticle } from '../types';

const NEWS_STORAGE_KEY = 'cycling-news';

export const saveNews = (news: NewsArticle[]): void => {
  localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(news));
  // Disparar evento personalizado para notificar cambios
  window.dispatchEvent(new CustomEvent('newsUpdated'));
};

export const loadNews = (): NewsArticle[] => {
  const stored = localStorage.getItem(NEWS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addNews = (article: NewsArticle): void => {
  const news = loadNews();
  const existingIndex = news.findIndex(n => n.id === article.id);
  
  if (existingIndex >= 0) {
    news[existingIndex] = article;
  } else {
    news.unshift(article); // Añadir al principio para que aparezca primero
  }
  
  saveNews(news);
};

export const removeNews = (articleId: string): void => {
  const news = loadNews();
  const filteredNews = news.filter(n => n.id !== articleId);
  saveNews(filteredNews);
};

export const updateNews = (article: NewsArticle): void => {
  const news = loadNews();
  const index = news.findIndex(n => n.id === article.id);
  
  if (index >= 0) {
    news[index] = article;
    saveNews(news);
  }
};

export const getNewsById = (articleId: string): NewsArticle | null => {
  const news = loadNews();
  return news.find(n => n.id === articleId) || null;
};

// Alias for getNews (for compatibility)
export const getNews = loadNews;