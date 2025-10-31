// src/components/data/promoters.ts

export interface Promoter {
  id: string;
  name: string;
  handle: string;
  niche: string;
  followers: string;
  avgViews: string;
  engagement: string;
  price: number;
  avatar: string;
  gradient: string;
  image1?: string;
  image2?: string;
  bio?: string;
  location?: string;
}

export const mockPromoters: Promoter[] = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    handle: '@fashionista_daily',
    niche: 'Fashion',
    followers: '250K',
    avgViews: '12K',
    engagement: '4.8%',
    price: 420,
    avatar: 'SM',
    gradient: 'from-pink-500 to-rose-500',
    image1: '/images/promoters/fashion1.jpg',
    image2: '/images/promoters/fashion2.jpg',
    bio: 'Passionate fashion influencer creating trendy outfit inspirations.',
    location: 'Los Angeles, USA'
  },
  {
    id: '2',
    name: 'Alex Chen',
    handle: '@tech_reviews_pro',
    niche: 'Technology',
    followers: '500K',
    avgViews: '28K',
    engagement: '5.6%',
    price: 750,
    avatar: 'AC',
    gradient: 'from-purple-500 to-indigo-500',
    image1: '/images/promoters/tech1.jpg',
    image2: '/images/promoters/tech2.jpg',
    bio: 'Tech reviewer focusing on gadgets, innovation, and lifestyle products.',
    location: 'San Francisco, USA'
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    handle: '@lifestyle_vibes',
    niche: 'Lifestyle',
    followers: '180K',
    avgViews: '8K',
    engagement: '4.4%',
    price: 320,
    avatar: 'ER',
    gradient: 'from-orange-500 to-pink-500',
    image1: '/images/promoters/lifestyle1.jpg',
    image2: '/images/promoters/lifestyle2.jpg',
    bio: 'Lifestyle creator sharing positivity, routines, and wellness tips.',
    location: 'Miami, USA'
  },
  {
    id: '4',
    name: 'Mike Johnson',
    handle: '@fitness_beast',
    niche: 'Fitness',
    followers: '320K',
    avgViews: '15K',
    engagement: '4.7%',
    price: 480,
    avatar: 'MJ',
    gradient: 'from-green-500 to-emerald-500',
    image1: '/images/promoters/fitness1.jpg',
    image2: '/images/promoters/fitness2.jpg',
    bio: 'Personal trainer helping others achieve their dream body.',
    location: 'New York, USA'
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    handle: '@beauty_secrets',
    niche: 'Beauty',
    followers: '420K',
    avgViews: '22K',
    engagement: '5.2%',
    price: 630,
    avatar: 'LT',
    gradient: 'from-pink-500 to-purple-500',
    image1: '/images/promoters/beauty1.jpg',
    image2: '/images/promoters/beauty2.jpg',
    bio: 'Beauty content creator specializing in skincare and product reviews.',
    location: 'London, UK'
  }
];
