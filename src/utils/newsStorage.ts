import { NewsArticle } from '../types';
import { supabase } from './supabaseClient';

export const saveNews = async (news: NewsArticle[]): Promise<void> => {
  for (const article of news) {
    await supabase
      .from('news')
      .upsert({
        id: article.id,
        title: article.title,
        content: article.content,
        summary: article.summary,
        image_url: article.imageUrl,
        author: article.author,
        category: article.category,
        tags: article.tags || [],
        published_date: article.publishedDate,
        is_featured: article.isFeatured || false,
        source_url: article.sourceUrl,
        views_count: article.viewsCount || 0,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });
  }

  window.dispatchEvent(new CustomEvent('newsUpdated'));
};

export const loadNews = async (): Promise<NewsArticle[]> => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('published_date', { ascending: false });

  if (error) {
    console.error('Error loading news:', error);
    return [];
  }

  return (data || []).map(article => ({
    id: article.id,
    title: article.title,
    content: article.content,
    summary: article.summary,
    imageUrl: article.image_url,
    author: article.author,
    category: article.category,
    tags: article.tags || [],
    publishedDate: article.published_date,
    isFeatured: article.is_featured,
    sourceUrl: article.source_url,
    viewsCount: article.views_count
  }));
};

export const addNews = async (article: NewsArticle): Promise<void> => {
  const { error } = await supabase
    .from('news')
    .upsert({
      id: article.id,
      title: article.title,
      content: article.content,
      summary: article.summary,
      image_url: article.imageUrl,
      author: article.author,
      category: article.category,
      tags: article.tags || [],
      published_date: article.publishedDate,
      is_featured: article.isFeatured || false,
      source_url: article.sourceUrl,
      views_count: article.viewsCount || 0,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'id'
    });

  if (error) {
    console.error('Error adding news:', error);
  } else {
    window.dispatchEvent(new CustomEvent('newsUpdated'));
  }
};

export const removeNews = async (articleId: string): Promise<void> => {
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', articleId);

  if (error) {
    console.error('Error removing news:', error);
  } else {
    window.dispatchEvent(new CustomEvent('newsUpdated'));
  }
};

export const updateNews = async (article: NewsArticle): Promise<void> => {
  const { error } = await supabase
    .from('news')
    .update({
      title: article.title,
      content: article.content,
      summary: article.summary,
      image_url: article.imageUrl,
      author: article.author,
      category: article.category,
      tags: article.tags || [],
      published_date: article.publishedDate,
      is_featured: article.isFeatured || false,
      source_url: article.sourceUrl,
      views_count: article.viewsCount || 0,
      updated_at: new Date().toISOString()
    })
    .eq('id', article.id);

  if (error) {
    console.error('Error updating news:', error);
  } else {
    window.dispatchEvent(new CustomEvent('newsUpdated'));
  }
};

export const getNewsById = async (articleId: string): Promise<NewsArticle | null> => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', articleId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    content: data.content,
    summary: data.summary,
    imageUrl: data.image_url,
    author: data.author,
    category: data.category,
    tags: data.tags || [],
    publishedDate: data.published_date,
    isFeatured: data.is_featured,
    sourceUrl: data.source_url,
    viewsCount: data.views_count
  };
};

export const getNews = loadNews;
