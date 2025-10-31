export interface Campaign {
  id: string;
  name: string;
  promoter: string;
  status: 'Requested' | 'Accepted' | 'Posted' | 'Completed';
  price: number;
  followers: string;
  engagement: string;
  date: string;
}

export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Product Launch Campaign',
    promoter: '@fashionista_daily',
    status: 'Posted',
    price: 350,
    followers: '250K',
    engagement: '4.2%',
    date: '2025-10-25'
  },
  {
    id: '2',
    name: 'Brand Awareness Push',
    promoter: '@tech_reviews_pro',
    status: 'Accepted',
    price: 500,
    followers: '500K',
    engagement: '5.8%',
    date: '2025-10-27'
  },
  {
    id: '3',
    name: 'Summer Collection Promo',
    promoter: '@lifestyle_vibes',
    status: 'Completed',
    price: 280,
    followers: '180K',
    engagement: '3.9%',
    date: '2025-10-20'
  },
  {
    id: '4',
    name: 'App Launch Campaign',
    promoter: '@influencer_hub',
    status: 'Requested',
    price: 420,
    followers: '320K',
    engagement: '4.5%',
    date: '2025-10-28'
  }
];
