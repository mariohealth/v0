'use client'
import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { 
  Gift, 
  TrendingUp, 
  Star,
  History,
  Search,
  Bookmark,
  BookmarkCheck,
  Trophy,
  Award,
  Crown,
  X
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

// Types
interface Reward {
  id: number;
  title: string;
  pointsRequired: number;
  category: 'Retail' | 'Travel' | 'Charity' | 'Health';
  logo: string;
  brand: string;
  value: string;
  description: string;
  isBookmarked?: boolean;
}

// Mock data with real brand logos
const allRewards: Reward[] = [
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

// Category Filter Component
function CategoryFilter({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}: { 
  categories: string[]; 
  activeCategory: string; 
  onCategoryChange: (category: string) => void; 
}) {
  const categoryColors = {
    'All': { bg: '#4DA1A9', text: '#FFFFFF' },
    'Retail': { bg: '#E3F2FD', text: '#1976D2' },
    'Travel': { bg: '#F3E5F5', text: '#7B1FA2' },
    'Charity': { bg: '#E8F5E8', text: '#388E3C' },
    'Health': { bg: '#FFF3E0', text: '#F57C00' }
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {categories.map((category) => {
        const isActive = activeCategory === category;
        const colors = categoryColors[category as keyof typeof categoryColors];
        
        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap mario-transition ${
              isActive ? 'mario-button-scale' : ''
            }`}
            style={{
              backgroundColor: isActive ? colors.bg : '#F6F4F0',
              color: isActive ? colors.text : '#666666',
              border: isActive ? 'none' : '1px solid #E8EAED'
            }}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}

// Enhanced Reward Card Component
function RewardCard({ 
  reward, 
  onRedeem, 
  onBookmark,
  onViewDetails,
  currentPoints = 2450
}: { 
  reward: Reward; 
  onRedeem: () => void;
  onBookmark: () => void;
  onViewDetails: () => void;
  currentPoints?: number;
}) {
  const canRedeem = reward.pointsRequired <= currentPoints;
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card 
        className={`relative cursor-pointer mario-transition ${
          isHovered ? 'mario-shadow-elevated' : 'mario-shadow-card'
        }`}
        style={{ 
          backgroundColor: '#FFFFFF',
          padding: '16px',
          borderRadius: '12px',
          border: isHovered ? '2px solid #4DA1A9' : '1px solid #E8EAED'
        }}
        onClick={onViewDetails}
      >
        {/* Bookmark Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBookmark();
          }}
          className="absolute top-3 right-3 p-1 rounded-full mario-transition hover:bg-gray-100 mario-focus-ring"
          aria-label={reward.isBookmarked ? 'Remove bookmark' : 'Save for later'}
        >
          {reward.isBookmarked ? (
            <BookmarkCheck className="h-4 w-4 text-accent" />
          ) : (
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        <div className="space-y-3">
          {/* Brand Logo */}
          <div className="flex items-start justify-between">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden"
              style={{ backgroundColor: '#F6F4F0' }}
            >
              <ImageWithFallback
                src={reward.logo}
                alt={`${reward.brand} logo`}
                className="w-12 h-12 object-contain"
              />
            </div>
          </div>
          
          {/* Title and Value */}
          <div className="space-y-2">
            <h4 className="font-medium leading-tight text-sm text-foreground">
              {reward.title}
            </h4>
            
            <div className="flex items-center justify-between">
              <Badge 
                variant="secondary"
                className="font-medium text-xs"
                style={{ 
                  backgroundColor: canRedeem ? '#79D7BE' : '#E8EAED',
                  color: canRedeem ? '#FFFFFF' : '#666666'
                }}
              >
                {reward.pointsRequired.toLocaleString()} pts
              </Badge>
              
              <div className="flex items-center gap-1">
                <span 
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: '#E3F2FD',
                    color: '#1976D2'
                  }}
                >
                  {reward.category}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onRedeem();
            }}
            disabled={!canRedeem}
            size="sm"
            className="w-full mario-button-scale mario-focus-ring"
            style={{
              backgroundColor: canRedeem ? '#4DA1A9' : '#E8EAED',
              color: canRedeem ? '#FFFFFF' : '#666666'
            }}
          >
            {canRedeem ? 'Redeem Now' : `Need ${(reward.pointsRequired - currentPoints).toLocaleString()} more pts`}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

// Reward Detail Modal
function RewardDetailModal({ 
  reward, 
  isOpen, 
  onClose, 
  onRedeem,
  currentPoints = 2450
}: {
  reward: Reward | null;
  isOpen: boolean;
  onClose: () => void;
  onRedeem: () => void;
  currentPoints?: number;
}) {
  if (!reward) return null;

  const canRedeem = reward.pointsRequired <= currentPoints;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-foreground">
              Reward Details
            </DialogTitle>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 mario-transition mario-focus-ring"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Brand Logo */}
          <div className="text-center">
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: '#F6F4F0' }}
            >
              <ImageWithFallback
                src={reward.logo}
                alt={`${reward.brand} logo`}
                className="w-16 h-16 object-contain"
              />
            </div>
            <h3 className="font-semibold text-foreground">{reward.title}</h3>
            <p className="text-sm text-muted-foreground">{reward.brand}</p>
          </div>

          {/* Points Required */}
          <div className="text-center">
            <Badge 
              variant="secondary"
              className="font-medium"
              style={{ 
                backgroundColor: canRedeem ? '#79D7BE' : '#E8EAED',
                color: canRedeem ? '#FFFFFF' : '#666666'
              }}
            >
              {reward.pointsRequired.toLocaleString()} Mario Points
            </Badge>
          </div>

          {/* Description */}
          <div>
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
              {reward.description}
            </DialogDescription>
          </div>

          {/* Action */}
          <div className="pt-4">
            <Button
              onClick={() => {
                onRedeem();
                onClose();
              }}
              disabled={!canRedeem}
              className="w-full mario-button-scale mario-focus-ring"
              style={{
                backgroundColor: canRedeem ? '#4DA1A9' : '#E8EAED',
                color: canRedeem ? '#FFFFFF' : '#666666'
              }}
            >
              {canRedeem ? 'Redeem Now' : `Need ${(reward.pointsRequired - currentPoints).toLocaleString()} more points`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Confetti Animation Component
function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: ['#4DA1A9', '#79D7BE', '#2E5077'][i % 3],
            left: `${Math.random() * 100}%`,
            top: '-10px'
          }}
          initial={{ y: -10, opacity: 1, rotate: 0 }}
          animate={{ 
            y: window.innerHeight + 10, 
            opacity: 0, 
            rotate: 360,
            x: Math.random() * 200 - 100
          }}
          transition={{ 
            duration: Math.random() * 2 + 2,
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>
  );
}

// Tier Progress Component
function TierProgress({ 
  currentPoints, 
  currentTier, 
  milestones = [
    { tier: 'Bronze', points: 0, icon: Award },
    { tier: 'Silver', points: 2000, icon: Star },
    { tier: 'Gold', points: 5000, icon: Trophy },
    { tier: 'Platinum', points: 10000, icon: Crown }
  ]
}: {
  currentPoints: number;
  currentTier: string;
  milestones?: { tier: string; points: number; icon: any }[];
}) {
  const currentMilestone = milestones.find(m => m.tier === currentTier);
  const nextMilestone = milestones.find(m => m.points > currentPoints);
  const progress = nextMilestone 
    ? ((currentPoints - (currentMilestone?.points || 0)) / (nextMilestone.points - (currentMilestone?.points || 0))) * 100
    : 100;

  return (
    <Card className="p-4 mario-shadow-card" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="space-y-4">
        {/* Current Tier */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentMilestone && (
              <currentMilestone.icon className="h-5 w-5 text-accent" fill="currentColor" />
            )}
            <span className="font-medium text-foreground">{currentTier} Member</span>
          </div>
          {nextMilestone && (
            <Badge variant="outline" className="text-xs">
              {nextMilestone.points - currentPoints} pts to {nextMilestone.tier}
            </Badge>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          
          {/* Milestones */}
          <div className="flex justify-between text-xs text-muted-foreground">
            {milestones.map((milestone, index) => (
              <div key={milestone.tier} className="flex flex-col items-center">
                <milestone.icon 
                  className={`h-3 w-3 ${currentPoints >= milestone.points ? 'text-accent' : 'text-muted-foreground'}`}
                  fill={currentPoints >= milestone.points ? 'currentColor' : 'none'}
                />
                <span className="mt-1">{milestone.tier}</span>
              </div>
            ))}
          </div>
        </div>

        {nextMilestone && (
          <p className="text-center text-xs text-muted-foreground">
            Unlock {nextMilestone.tier} tier benefits at {nextMilestone.points.toLocaleString()} points
          </p>
        )}
      </div>
    </Card>
  );
}

export function MarioRewardsEnhanced() {
  const [currentPoints] = useState(2450);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [rewards, setRewards] = useState(allRewards);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const categories = ['All', 'Retail', 'Travel', 'Charity', 'Health'];

  // Filter rewards based on search and category
  const filteredRewards = rewards.filter(reward => {
    const matchesSearch = reward.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reward.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || reward.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle bookmark toggle
  const handleBookmark = (rewardId: number) => {
    setRewards(prev => prev.map(reward => 
      reward.id === rewardId 
        ? { ...reward, isBookmarked: !reward.isBookmarked }
        : reward
    ));
    
    const reward = rewards.find(r => r.id === rewardId);
    toast.success(
      reward?.isBookmarked ? "Removed from saved rewards" : "Saved for later!",
      {
        description: reward?.isBookmarked ? "You can find this in your bookmarks" : "You can view saved rewards anytime"
      }
    );
  };

  // Handle redemption
  const handleRedeem = (reward: Reward) => {
    if (reward.pointsRequired <= currentPoints) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      
      toast.success(`🎉 ${reward.title} redeemed!`, {
        description: `${reward.pointsRequired.toLocaleString()} points used. You'll receive your reward within 24 hours.`
      });
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0" style={{ backgroundColor: '#FDFCFA' }}>
      {showConfetti && <Confetti />}
      
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="font-bold text-2xl text-foreground mb-2">Mario Rewards</h1>
            <p className="text-muted-foreground">Redeem your points for amazing rewards</p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search rewards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 mario-focus-ring"
              style={{ backgroundColor: '#FFFFFF' }}
            />
          </div>

          {/* Points Balance & Tier Progress */}
          <div className="space-y-4">
            {/* Points Balance */}
            <Card 
              className="p-6"
              style={{ 
                backgroundColor: '#2E5077',
                color: '#FFFFFF'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-bold text-3xl mb-1">
                    {currentPoints.toLocaleString()}
                  </div>
                  <p className="text-sm opacity-90">Available Points</p>
                </div>
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                >
                  <Gift className="h-8 w-8" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-90">
                  You've saved $1,247 this year
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mario-button-scale"
                  style={{ 
                    backgroundColor: '#FFFFFF',
                    color: '#2E5077'
                  }}
                >
                  <History className="h-4 w-4 mr-1" />
                  History
                </Button>
              </div>
            </Card>

            {/* Tier Progress */}
            <TierProgress currentPoints={currentPoints} currentTier="Silver" />
          </div>

          {/* Category Filters */}
          <div style={{ marginBottom: '24px' }}>
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          {/* Rewards Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-foreground">
                {activeCategory === 'All' ? 'All Rewards' : `${activeCategory} Rewards`}
              </h3>
              <span className="text-sm text-muted-foreground">
                {filteredRewards.length} reward{filteredRewards.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {filteredRewards.map((reward) => (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <RewardCard
                      reward={reward}
                      currentPoints={currentPoints}
                      onRedeem={() => handleRedeem(reward)}
                      onBookmark={() => handleBookmark(reward.id)}
                      onViewDetails={() => {
                        setSelectedReward(reward);
                        setShowModal(true);
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredRewards.length === 0 && (
              <div className="text-center py-12">
                <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium text-foreground mb-2">No rewards found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or category filter
                </p>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <Card className="p-4 mario-shadow-card" style={{ backgroundColor: '#FFFFFF' }}>
            <h4 className="font-medium mb-4 text-foreground">Recent Activity</h4>
            <div className="space-y-3">
              {[
                { action: "Earned 150 points", detail: "Booked appointment with Dr. Johnson", date: "2 days ago" },
                { action: "Redeemed $15 Starbucks gift card", detail: "Used 1,500 points", date: "1 week ago" },
                { action: "Earned 75 points", detail: "Used Mario's Pick for MRI", date: "2 weeks ago" }
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center mt-0.5"
                    style={{ backgroundColor: 'rgba(77,161,169,0.1)' }}
                  >
                    <TrendingUp className="h-4 w-4 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.detail}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Reward Detail Modal */}
      <RewardDetailModal
        reward={selectedReward}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedReward(null);
        }}
        onRedeem={() => selectedReward && handleRedeem(selectedReward)}
        currentPoints={currentPoints}
      />
    </div>
  );
}