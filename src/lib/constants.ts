import { NewsCategory } from '@/types/news';

export const NEWS_CATEGORIES: Record<string, NewsCategory> = {
  technology: {
    id: 'technology',
    title: 'Technology & Innovation',
    subtitle: 'AI, Breakthroughs, Digital Transformation',
    icon: '💻',
    class: 'tech-icon',
    queries: [
      'latest technology news artificial intelligence breakthrough today',
      'tech innovation startup funding digital transformation',
      'cybersecurity data privacy technology trends'
    ]
  },
  finance: {
    id: 'finance',
    title: 'Finance & Economy',
    subtitle: 'Markets, Crypto, Economic Indicators',
    icon: '📈',
    class: 'finance-icon',
    queries: [
      'financial markets stock market cryptocurrency news today',
      'economy inflation interest rates federal reserve',
      'banking fintech investment trends'
    ]
  },
  sports: {
    id: 'sports',
    title: 'Sports & Competition',
    subtitle: 'Global Sports, Championships, Athletes',
    icon: '⚽',
    class: 'sports-icon',
    queries: [
      'sports news today major leagues championship',
      'Olympic games FIFA world cup latest results',
      'athlete transfers records breaking news'
    ]
  },
  science: {
    id: 'science',
    title: 'Science & Research',
    subtitle: 'Scientific Discoveries, Medical Breakthroughs',
    icon: '🔬',
    class: 'science-icon',
    queries: [
      'scientific discovery medical breakthrough research',
      'space exploration NASA discoveries',
      'climate science environmental research'
    ]
  },
  global: {
    id: 'global',
    title: 'Global Affairs',
    subtitle: 'Politics, Climate, International Relations',
    icon: '🌍',
    class: 'global-icon',
    queries: [
      'global politics international relations diplomacy',
      'climate change environmental policy',
      'world leaders summit conference'
    ]
  }
};

export const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
export const API_CONFIG = {
  model: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 2000
};

export const DEMO_MODE_ARTICLES = [
  {
    id: 'demo-1',
    title: 'AI Breakthrough in Medical Diagnosis',
    summary: 'Researchers develop AI system that can detect rare diseases with 95% accuracy',
    content: 'A new artificial intelligence system has been developed by researchers at leading medical institutions...',
    category: 'technology',
    sources: ['Medical Journal', 'TechNews'],
    sourceUrls: ['#demo', '#demo'],
    credibilityScore: 9.2,
    factCheck: 'Verified by multiple medical sources',
    timestamp: new Date().toISOString(),
    searchTime: 2.3
  },
  {
    id: 'demo-2',
    title: 'Global Markets Show Strong Recovery',
    summary: 'Stock markets worldwide posting gains as economic indicators improve',
    content: 'Financial markets across the globe are showing signs of strong recovery...',
    category: 'finance',
    sources: ['Reuters', 'Financial Times'],
    sourceUrls: ['#demo', '#demo'],
    credibilityScore: 8.7,
    factCheck: 'Data confirmed by financial institutions',
    timestamp: new Date().toISOString(),
    searchTime: 1.8
  }
];
