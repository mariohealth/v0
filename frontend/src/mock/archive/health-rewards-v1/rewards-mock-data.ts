// Mock data archived from mario-rewards-enhanced.tsx
// Archive Date: November 10, 2024
// Context: Mock data used in Rewards components before migrating to live API calls

export interface Reward {
  id: number;
  title: string;
  pointsRequired: number;
  category: string;
  logo: string;
  brand: string;
  value: string;
  description: string;
  isBookmarked?: boolean;
}

export const mockAllRewards: Reward[] = [
  {
    id: 1,
    title: '$25 Amazon Gift Card',
    pointsRequired: 2500,
    category: 'Retail',
    logo: 'https://images.unsplash.com/photo-1704204656144-3dd12c110dd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWF6b24lMjBsb2dvJTIwYnJhbmR8ZW58MXx8fHwxNzU5ODgzODExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    brand: 'Amazon',
    value: '$25',
    description: 'Perfect for everyday purchases from the world\'s largest online retailer. Use for books, electronics, household items, and more.'
  },
  {
    id: 2,
    title: '$15 Starbucks Gift Card',
    pointsRequired: 1500,
    category: 'Retail',
    logo: 'https://images.unsplash.com/photo-1657979964801-3e3bb6c03a7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFyYnVja3MlMjBjb2ZmZWUlMjBsb2dvfGVufDF8fHx8MTc1OTg2OTQzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    brand: 'Starbucks',
    value: '$15',
    description: 'Enjoy your favorite coffee, tea, or snack at any Starbucks location. Valid at participating stores nationwide.'
  },
  {
    id: 3,
    title: '$100 Apple Gift Card',
    pointsRequired: 10000,
    category: 'Retail',
    logo: 'https://images.unsplash.com/photo-1758467700789-d6f49099c884?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcHBsZSUyMGxvZ28lMjBicmFuZCUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU5OTA5MjU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    brand: 'Apple',
    value: '$100',
    description: 'Use toward apps, games, music, movies, TV shows, or Apple products. Redeemable on the App Store, iTunes Store, and Apple Store.'
  },
  {
    id: 4,
    title: '$50 Target Gift Card',
    pointsRequired: 5000,
    category: 'Retail',
    logo: 'https://images.unsplash.com/photo-1615557854978-2eac0cd47b0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YXJnZXQlMjBzdG9yZSUyMGxvZ298ZW58MXx8fHwxNzU5ODY5NDMxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    brand: 'Target',
    value: '$50',
    description: 'Great for home essentials, clothing, groceries, and more. Valid at Target stores and Target.com.'
  },
  {
    id: 5,
    title: 'Hotel Night Stay',
    pointsRequired: 7500,
    category: 'Travel',
    logo: 'https://images.unsplash.com/photo-1754334757473-d03efe89ab45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHRyYXZlbCUyMGFjY29tbW9kYXRpb258ZW58MXx8fHwxNzU5ODk4Mzc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    brand: 'Hotels.com',
    value: 'Up to $150',
    description: 'Redeem for one night stay at participating hotels. Subject to availability and blackout dates may apply.'
  },
  {
    id: 6,
    title: '$10 Charity Donation',
    pointsRequired: 1000,
    category: 'Charity',
    logo: 'https://images.unsplash.com/photo-1600408986933-5feb4659ebff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFyaXR5JTIwZG9uYXRpb24lMjBoZWFydHxlbnwxfHx8fDE3NTk4OTgzNzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    brand: 'United Way',
    value: '$10',
    description: 'Support causes you care about. Your donation will be matched by Mario Health to double the impact.'
  },
  {
    id: 7,
    title: '$20 Wellness Credit',
    pointsRequired: 2000,
    category: 'Health',
    logo: 'https://images.unsplash.com/photo-1668417421159-e6dacfad76a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMGhlYWx0aCUyMG1lZGljYWx8ZW58MXx8fHwxNzU5OTA5MjY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    brand: 'Mario Wellness',
    value: '$20',
    description: 'Apply toward wellness services, gym memberships, or health supplements through Mario Health partners.'
  },
  {
    id: 8,
    title: '$75 Southwest Airlines',
    pointsRequired: 7500,
    category: 'Travel',
    logo: 'https://images.unsplash.com/photo-1697389825397-1cd09e100694?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3V0aHdlc3QlMjBhaXJsaW5lcyUyMHBsYW5lfGVufDF8fHx8MTc1OTkwOTI3MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    brand: 'Southwest Airlines',
    value: '$75',
    description: 'Flight credit valid for one year from issue date. Can be applied to any Southwest Airlines booking.'
  }
];

