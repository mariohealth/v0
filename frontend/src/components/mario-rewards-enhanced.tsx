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
  X,
  WifiOff,
  RefreshCw
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '@/lib/contexts/AuthContext';
import { fetchRewardsData, updateMarioPoints, type Reward } from '@/lib/api';
import { mockAllRewards } from '@/mock/archive/health-rewards-v1/rewards-mock-data';
import confetti from 'canvas-confetti';

// Types (now imported from api.ts)
// interface Reward {
//   id: number;
//   title: string;
//   pointsRequired: number;
//   category: 'Retail' | 'Travel' | 'Charity' | 'Health';
//   logo: string;
//   brand: string;
//   value: string;
//   description: string;
//   isBookmarked?: boolean;
// }

// Mock data is now imported from archive folder

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
  const { user } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [currentPoints, setCurrentPoints] = useState(2450);
  const [nextMilestone, setNextMilestone] = useState(5000);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Loading and error state
  const [loading, setLoading] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  const categories = ['All', 'Retail', 'Travel', 'Charity', 'Health'];

  // Fetch data from API with fallback to mock data
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) {
        // No user, use mock data
        setRewards(mockAllRewards);
        setCurrentPoints(2450);
        setNextMilestone(5000);
        setLoading(false);
        setOfflineMode(true);
        return;
      }

      setLoading(true);
      setOfflineMode(false);

      try {
        const rewardsData = await fetchRewardsData(user.uid);
        setRewards(rewardsData.rewards || []);
        setCurrentPoints(rewardsData.currentPoints || 2450);
        setNextMilestone(rewardsData.nextMilestone || 5000);
      } catch (error) {
        console.error('[Rewards] Error fetching data, using fallback:', error);
        // Fallback to mock data
        setRewards(mockAllRewards);
        setCurrentPoints(2450);
        setNextMilestone(5000);
        setOfflineMode(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.uid]);

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
  const handleRedeem = async (reward: Reward) => {
    if (reward.pointsRequired <= currentPoints) {
      // Trigger confetti animation
      setShowConfetti(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => setShowConfetti(false), 3000);
      
      // Update points via API
      if (user?.uid) {
        try {
          const newTotal = await updateMarioPoints(user.uid, -reward.pointsRequired);
          setCurrentPoints(newTotal);
        } catch (error) {
          console.error('[Rewards] Error updating points:', error);
          // Update locally as fallback
          setCurrentPoints(prev => prev - reward.pointsRequired);
        }
      } else {
        // Update locally if no user
        setCurrentPoints(prev => prev - reward.pointsRequired);
      }
      
      toast.success(`🎉 ${reward.title} redeemed!`, {
        description: `${reward.pointsRequired.toLocaleString()} points used. You'll receive your reward within 24 hours.`
      });
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen pb-20 md:pb-0 flex items-center justify-center" style={{ backgroundColor: '#FDFCFA' }}>
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: '#2E5077' }} />
          <p className="text-sm" style={{ color: '#666666' }}>Loading Rewards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0" style={{ backgroundColor: '#FDFCFA' }}>
      {showConfetti && <Confetti />}
      
      {/* Offline Mode Banner */}
      {offlineMode && (
        <div 
          className="sticky top-0 z-50 px-4 py-2 flex items-center gap-2"
          style={{ 
            backgroundColor: '#FFF3CD',
            borderBottom: '1px solid #FFE69C'
          }}
        >
          <WifiOff className="h-4 w-4" style={{ color: '#856404' }} />
          <p className="text-sm font-medium" style={{ color: '#856404' }}>
            Offline Mode: Showing cached data
          </p>
        </div>
      )}
      
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