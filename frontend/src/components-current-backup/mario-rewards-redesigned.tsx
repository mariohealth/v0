'use client'
import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Gift, 
  TrendingUp, 
  ChevronRight, 
  Star,
  History,
  ChevronLeft
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Reward Category Pills Component
function CategoryPill({ category }: { category: 'Retail' | 'Travel' | 'Charity' }) {
  const colors = {
    'Retail': { bg: '#E3F2FD', text: '#1976D2' },
    'Travel': { bg: '#F3E5F5', text: '#7B1FA2' },
    'Charity': { bg: '#E8F5E8', text: '#388E3C' }
  };
  
  const color = colors[category];
  
  return (
    <span 
      className="inline-block px-2 py-1 rounded text-xs font-medium"
      style={{ 
        backgroundColor: color.bg, 
        color: color.text 
      }}
    >
      {category}
    </span>
  );
}

// Compact Reward Card Component
function RewardCard({ 
  reward, 
  onRedeem, 
  featured = false 
}: { 
  reward: any; 
  onRedeem: () => void;
  featured?: boolean;
}) {
  const canRedeem = reward.pointsRequired <= 2450; // Current user points
  
  return (
    <Card 
      className={`mario-transition mario-hover-reward cursor-pointer ${
        featured ? 'min-w-[280px]' : ''
      }`}
      style={{ 
        backgroundColor: '#FFFFFF',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(46,80,119,0.08)'
      }}
      onClick={canRedeem ? onRedeem : undefined}
    >
      <div className="space-y-3">
        {/* Logo and Category */}
        <div className="flex items-start justify-between">
          <div 
            className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: '#F5F5F5' }}
          >
            <ImageWithFallback
              src={reward.logo}
              alt={`${reward.title} logo`}
              className="w-8 h-8 object-contain"
            />
          </div>
          <CategoryPill category={reward.category} />
        </div>
        
        {/* Title and Points - Visual Hierarchy */}
        <div className="space-y-2">
          <h4 
            className="font-medium leading-tight"
            style={{ 
              fontSize: '15px',
              color: '#2E5077',
              lineHeight: '1.3'
            }}
          >
            {reward.title}
          </h4>
          
          <div className="flex items-center justify-between">
            <Badge 
              variant="secondary"
              className="font-medium"
              style={{ 
                backgroundColor: canRedeem ? '#79D7BE' : '#E0E0E0',
                color: canRedeem ? '#FFFFFF' : '#666666',
                fontSize: '12px'
              }}
            >
              {reward.pointsRequired.toLocaleString()} pts
            </Badge>
            
            {/* CTA */}
            {canRedeem ? (
              <Button 
                size="sm"
                className="h-7 px-3 mario-button-scale"
                style={{ 
                  backgroundColor: '#4DA1A9',
                  color: '#FFFFFF',
                  fontSize: '12px'
                }}
              >
                Redeem
              </Button>
            ) : (
              <ChevronRight 
                className="w-4 h-4"
                style={{ color: '#999999' }}
              />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

// Featured Carousel Component
function FeaturedCarousel({ 
  rewards, 
  onRedeem 
}: { 
  rewards: any[]; 
  onRedeem: (reward: any) => void;
}) {
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('featured-carousel');
    if (container) {
      const scrollAmount = 300;
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 
          className="font-medium"
          style={{ 
            fontSize: '16px',
            color: '#2E5077'
          }}
        >
          Featured Rewards
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll('left')}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll('right')}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div 
        id="featured-carousel"
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {rewards.map((reward, index) => (
          <RewardCard
            key={`featured-${index}`}
            reward={reward}
            onRedeem={() => onRedeem(reward)}
            featured={true}
          />
        ))}
      </div>
    </div>
  );
}

export function MarioRewardsRedesigned() {
  const currentPoints = 2450;
  const nextTierPoints = 5000;
  const currentTier = 'Silver';
  const nextTier = 'Gold';
  const tierProgress = (currentPoints / nextTierPoints) * 100;

  const allRewards = [
    {
      id: 1,
      title: '$25 Amazon Gift Card',
      pointsRequired: 2500,
      category: 'Retail' as const,
      logo: 'https://images.unsplash.com/photo-1662947368907-808ab49b9495?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWF6b24lMjBnaWZ0JTIwY2FyZCUyMGxvZ298ZW58MXx8fHwxNzU5ODk4Mzc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 2,
      title: '$10 Charity Donation',
      pointsRequired: 1000,
      category: 'Charity' as const,
      logo: 'https://images.unsplash.com/photo-1600408986933-5feb4659ebff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFyaXR5JTIwZG9uYXRpb24lMjBoZWFydHxlbnwxfHx8fDE3NTk4OTgzNzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 3,
      title: '$15 Starbucks Gift Card',
      pointsRequired: 1500,
      category: 'Retail' as const,
      logo: 'https://images.unsplash.com/photo-1657979964801-3e3bb6c03a7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFyYnVja3MlMjBjb2ZmZWUlMjBsb2dvfGVufDF8fHx8MTc1OTg2OTQzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 4,
      title: '$50 Target Gift Card',
      pointsRequired: 5000,
      category: 'Retail' as const,
      logo: 'https://images.unsplash.com/photo-1615557854978-2eac0cd47b0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YXJnZXQlMjBzdG9yZSUyMGxvZ298ZW58MXx8fHwxNzU5ODY5NDMxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 5,
      title: 'Hotel Night Stay',
      pointsRequired: 7500,
      category: 'Travel' as const,
      logo: 'https://images.unsplash.com/photo-1754334757473-d03efe89ab45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHRyYXZlbCUyMGFjY29tbW9kYXRpb258ZW58MXx8fHwxNzU5ODk4Mzc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 6,
      title: '$100 Apple Gift Card',
      pointsRequired: 10000,
      category: 'Retail' as const,
      logo: 'https://images.unsplash.com/photo-1694878982007-0c361cc37960?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcHBsZSUyMHN0b3JlJTIwZ2lmdCUyMGNhcmR8ZW58MXx8fHwxNzU5ODk4Mzc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ];

  // Featured rewards (available to redeem)
  const featuredRewards = allRewards.filter(reward => reward.pointsRequired <= currentPoints);

  const handleRedeem = (reward: any) => {
    console.log('Redeeming reward:', reward.title);
    // TODO: Implement redemption logic
  };

  return (
    <div 
      className="min-h-screen pb-20 md:pb-0"
      style={{ backgroundColor: '#F6F4F0' }}
    >
      <div className="max-w-sm mx-auto px-4 py-6 space-y-6">
        {/* Hero Section */}
        <div className="space-y-4">
          {/* Points Balance Card */}
          <Card 
            className="p-4"
            style={{ 
              backgroundColor: '#2E5077',
              color: '#FFFFFF',
              borderRadius: '16px'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div 
                  className="font-bold mb-1"
                  style={{ fontSize: '32px', lineHeight: '1.2' }}
                >
                  {currentPoints.toLocaleString()}
                </div>
                <p 
                  className="opacity-90"
                  style={{ fontSize: '14px' }}
                >
                  Available Points
                </p>
              </div>
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <Gift className="w-7 h-7" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span style={{ fontSize: '13px', opacity: 0.9 }}>
                You've saved $1,247 this year
              </span>
              <Button
                variant="secondary"
                size="sm"
                className="mario-button-scale h-7 px-3"
                style={{ 
                  backgroundColor: '#FFFFFF',
                  color: '#2E5077',
                  fontSize: '12px'
                }}
              >
                <History className="w-3 h-3 mr-1" />
                View History
              </Button>
            </div>
          </Card>

          {/* Tier Progress Card */}
          <Card 
            className="p-4"
            style={{ 
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(46,80,119,0.08)'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Star 
                  className="w-4 h-4"
                  style={{ color: '#4DA1A9' }}
                  fill="currentColor"
                />
                <span 
                  className="font-medium"
                  style={{ 
                    fontSize: '14px',
                    color: '#2E5077'
                  }}
                >
                  {currentTier} Member
                </span>
              </div>
              <Badge 
                variant="outline"
                style={{ 
                  fontSize: '11px',
                  color: '#666666'
                }}
              >
                {nextTierPoints - currentPoints} pts to {nextTier}
              </Badge>
            </div>
            
            <Progress 
              value={tierProgress} 
              className="mb-2 h-2"
              style={{ backgroundColor: '#F0F0F0' }}
            />
            
            <p 
              className="text-center"
              style={{ 
                fontSize: '12px',
                color: '#666666'
              }}
            >
              Unlock {nextTier} tier benefits at {nextTierPoints.toLocaleString()} points
            </p>
          </Card>
        </div>

        {/* Featured Rewards Carousel */}
        {featuredRewards.length > 0 && (
          <FeaturedCarousel 
            rewards={featuredRewards}
            onRedeem={handleRedeem}
          />
        )}

        {/* All Rewards Grid */}
        <div className="space-y-3">
          <h3 
            className="font-medium"
            style={{ 
              fontSize: '16px',
              color: '#2E5077'
            }}
          >
            All Rewards
          </h3>
          
          <div 
            className="grid grid-cols-2 gap-2"
            style={{ gap: '8px' }}
          >
            {allRewards.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                onRedeem={() => handleRedeem(reward)}
              />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card 
          className="p-4"
          style={{ 
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(46,80,119,0.08)'
          }}
        >
          <h4 
            className="font-medium mb-3"
            style={{ 
              fontSize: '14px',
              color: '#2E5077'
            }}
          >
            Recent Activity
          </h4>
          <div className="space-y-3">
            {[
              { action: "Earned 150 points", detail: "Booked appointment with Dr. Johnson", date: "2 days ago" },
              { action: "Redeemed $10 gift card", detail: "Amazon gift card", date: "1 week ago" },
              { action: "Earned 75 points", detail: "Used Mario's Pick for MRI", date: "2 weeks ago" }
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                  style={{ backgroundColor: 'rgba(77,161,169,0.1)' }}
                >
                  <TrendingUp 
                    className="w-3 h-3"
                    style={{ color: '#4DA1A9' }}
                  />
                </div>
                <div className="flex-1">
                  <p 
                    className="font-medium"
                    style={{ 
                      fontSize: '13px',
                      color: '#2E5077'
                    }}
                  >
                    {activity.action}
                  </p>
                  <p 
                    style={{ 
                      fontSize: '12px',
                      color: '#666666'
                    }}
                  >
                    {activity.detail}
                  </p>
                  <p 
                    style={{ 
                      fontSize: '11px',
                      color: '#999999'
                    }}
                  >
                    {activity.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}