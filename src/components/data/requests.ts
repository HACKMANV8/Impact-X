export interface PromotionRequest {
  id: string;
  creatorName: string;
  brandName: string;
  contentType: string;
  price: number;
  message: string;
  date: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export const mockRequests: PromotionRequest[] = [
  {
    id: '1',
    creatorName: '@alex_brand',
    brandName: 'TechStyle Co.',
    contentType: '1 Instagram Story + 1 Post',
    price: 450,
    message: 'Looking for authentic tech product review for our new smartwatch launch.',
    date: '2025-10-29',
    status: 'pending'
  },
  {
    id: '2',
    creatorName: '@sarah_marketing',
    brandName: 'Beauty Bliss',
    contentType: '2 Instagram Stories',
    price: 320,
    message: 'Need promotion for our new skincare line. Target: women 25-35.',
    date: '2025-10-28',
    status: 'pending'
  },
  {
    id: '3',
    creatorName: '@mike_ventures',
    brandName: 'FitLife App',
    contentType: '1 Reel + 1 Story',
    price: 580,
    message: 'Fitness app launch campaign. Looking for authentic fitness content.',
    date: '2025-10-27',
    status: 'accepted'
  },
  {
    id: '4',
    creatorName: '@emma_creative',
    brandName: 'EcoWear',
    contentType: '1 Instagram Post',
    price: 250,
    message: 'Sustainable fashion brand seeking eco-conscious promotion.',
    date: '2025-10-26',
    status: 'accepted'
  }
];
