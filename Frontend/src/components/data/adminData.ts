export interface Transaction {
  id: string;
  date: string;
  user: string;
  userType: 'Creator' | 'Promoter';
  amount: number;
  commission: number;
  status: 'Completed' | 'Pending' | 'Refunded';
}

export interface Dispute {
  id: string;
  date: string;
  creator: string;
  promoter: string;
  amount: number;
  reason: string;
  status: 'Open' | 'Investigating' | 'Resolved';
}

export const mockTransactions: Transaction[] = [
  {
    id: 'TXN-001',
    date: '2025-10-29',
    user: '@fashionista_daily',
    userType: 'Promoter',
    amount: 450,
    commission: 45,
    status: 'Completed'
  },
  {
    id: 'TXN-002',
    date: '2025-10-28',
    user: '@alex_brand',
    userType: 'Creator',
    amount: 320,
    commission: 32,
    status: 'Completed'
  },
  {
    id: 'TXN-003',
    date: '2025-10-28',
    user: '@tech_reviews_pro',
    userType: 'Promoter',
    amount: 580,
    commission: 58,
    status: 'Pending'
  },
  {
    id: 'TXN-004',
    date: '2025-10-27',
    user: '@sarah_marketing',
    userType: 'Creator',
    amount: 250,
    commission: 25,
    status: 'Completed'
  },
  {
    id: 'TXN-005',
    date: '2025-10-27',
    user: '@lifestyle_vibes',
    userType: 'Promoter',
    amount: 380,
    commission: 38,
    status: 'Completed'
  }
];

export const mockDisputes: Dispute[] = [
  {
    id: 'DSP-001',
    date: '2025-10-28',
    creator: '@alex_brand',
    promoter: '@influencer_hub',
    amount: 420,
    reason: 'Content not posted as agreed',
    status: 'Investigating'
  },
  {
    id: 'DSP-002',
    date: '2025-10-26',
    creator: '@sarah_marketing',
    promoter: '@lifestyle_vibes',
    amount: 280,
    reason: 'Quality of content not as expected',
    status: 'Resolved'
  },
  {
    id: 'DSP-003',
    date: '2025-10-25',
    creator: '@mike_ventures',
    promoter: '@fashionista_daily',
    amount: 350,
    reason: 'Delayed posting',
    status: 'Open'
  }
];

export const monthlyRevenueData = [
  { month: 'Apr', revenue: 12500, deals: 45 },
  { month: 'May', revenue: 15800, deals: 52 },
  { month: 'Jun', revenue: 18200, deals: 61 },
  { month: 'Jul', revenue: 21500, deals: 68 },
  { month: 'Aug', revenue: 24800, deals: 78 },
  { month: 'Sep', revenue: 28300, deals: 85 },
  { month: 'Oct', revenue: 32100, deals: 94 }
];

export const topNiches = [
  { niche: 'Fashion', deals: 245, percentage: 28 },
  { niche: 'Tech', deals: 198, percentage: 23 },
  { niche: 'Beauty', deals: 176, percentage: 20 },
  { niche: 'Fitness', deals: 134, percentage: 15 },
  { niche: 'Lifestyle', deals: 122, percentage: 14 }
];
