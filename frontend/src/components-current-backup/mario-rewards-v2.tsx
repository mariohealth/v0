'use client'
import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { toast } from 'sonner@2.0.3';
import {
  Gift,
  Trophy,
  Heart,
  Activity,
  FileText,
  Calendar,
  Upload,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  Bell,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface RewardsProps {
  onBack?: () => void;
}

interface EarnAction {
  id: string;
  title: string;
  subtitle: string;
  points: number;
  progress: number;
  icon: any;
  category: string;
  completed?: boolean;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  points: number;
  value: string;
  icon: any;
  available: boolean;
}

interface Achievement {
  id: string;
  points: number;
  description: string;
  date: string;
}

interface RedemptionHistoryItem {
  id: string;
  title: string;
  points: number;
  date: string;
}

export function MarioRewardsV2({ onBack }: RewardsProps) {
  const [currentPoints] = useState(1250);
  const [nextMilestone] = useState(1500);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [preventiveCareOpen, setPreventiveCareOpen] = useState(true);
  const [healthyHabitsOpen, setHealthyHabitsOpen] = useState(false);
  const [engagementOpen, setEngagementOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('earn');

  const progressPercent = (currentPoints / nextMilestone) * 100;
  const pointsNeeded = nextMilestone - currentPoints;

  const earnActions: EarnAction[] = [
    {
      id: 'first-appointment',
      title: 'Book your first appointment',
      subtitle: 'Schedule with any provider',
      points: 100,
      progress: 0,
      icon: Calendar,
      category: 'preventive',
    },
    {
      id: 'annual-physical',
      title: 'Complete your annual physical',
      subtitle: 'Preventive care milestone',
      points: 250,
      progress: 0,
      icon: Heart,
      category: 'preventive',
    },
    {
      id: 'flu-shot',
      title: 'Get your flu shot',
      subtitle: 'Seasonal vaccination',
      points: 100,
      progress: 0,
      icon: Activity,
      category: 'preventive',
    },
    {
      id: 'physical-activity',
      title: 'Log physical activity',
      subtitle: 'Track your wellness journey',
      points: 50,
      progress: 60,
      icon: Activity,
      category: 'habits',
    },
    {
      id: 'nutrition-quiz',
      title: 'Take nutrition quiz',
      subtitle: 'Learn about healthy eating',
      points: 25,
      progress: 100,
      icon: Heart,
      category: 'habits',
      completed: true,
    },
    {
      id: 'upload-insurance',
      title: 'Upload your insurance',
      subtitle: 'Complete your profile',
      points: 50,
      progress: 100,
      icon: Upload,
      category: 'engagement',
      completed: true,
    },
    {
      id: 'concierge-schedule',
      title: 'Schedule with Concierge',
      subtitle: 'Book through MarioAI',
      points: 50,
      progress: 100,
      icon: MessageSquare,
      category: 'engagement',
      completed: true,
    },
  ];

  const recentAchievements: Achievement[] = [
    { id: '1', points: 50, description: 'Booked with Concierge', date: '2 days ago' },
    { id: '2', points: 25, description: 'Completed Nutrition Quiz', date: '1 week ago' },
    { id: '3', points: 100, description: 'Preventive Screening', date: '3 weeks ago' },
  ];

  const availableRewards: Reward[] = [
    {
      id: 'gift-card-25',
      title: '$25 Gift Card',
      description: 'Amazon, Target, or Walmart',
      points: 2500,
      value: '$25',
      icon: Gift,
      available: false,
    },
    {
      id: 'health-credit-50',
      title: '$50 Health Credit',
      description: 'Apply to any procedure or visit',
      points: 5000,
      value: '$50',
      icon: Heart,
      available: false,
    },
    {
      id: 'charity-donation',
      title: 'Donate to Charity',
      description: 'Support a health-focused cause',
      points: 1000,
      value: '$10',
      icon: Heart,
      available: true,
    },
  ];

  const redemptionHistory: RedemptionHistoryItem[] = [
    { id: '1', title: '$25 Gift Card', points: 2500, date: 'Oct 2025' },
    { id: '2', title: 'Charity Donation', points: 1000, date: 'Sep 2025' },
  ];

  const tiers = [
    { name: 'Bronze', icon: '🥉', threshold: 0, current: currentPoints >= 0 },
    { name: 'Silver', icon: '🥈', threshold: 2500, current: false },
    { name: 'Gold', icon: '🥇', threshold: 5000, current: false },
    { name: 'Diamond', icon: '💎', threshold: 10000, current: false },
  ];

  const handleRedeem = (reward: Reward) => {
    if (currentPoints >= reward.points) {
      toast.success(`🎉 You redeemed ${reward.title}!`, {
        description: 'Check your email for details.',
      });
      setSelectedReward(null);
    }
  };

  const handleDoAction = (action: EarnAction) => {
    toast.success(`🎯 Let's get started!`, {
      description: `Complete "${action.title}" to earn +${action.points} points.`,
    });
  };

  const preventiveActions = earnActions.filter((a) => a.category === 'preventive');
  const habitsActions = earnActions.filter((a) => a.category === 'habits');
  const engagementActions = earnActions.filter((a) => a.category === 'engagement');

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gift className="h-6 w-6 text-primary" />
            <h1 className="text-primary">Rewards</h1>
          </div>
          <Button variant="ghost" size="icon" className="mario-button-scale">
            <Bell className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="sticky top-[73px] z-10 bg-background border-b border-border">
            <TabsList className="w-full grid grid-cols-2 rounded-none h-12 bg-transparent p-0">
              <TabsTrigger
                value="earn"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary"
                style={{ transition: 'all 300ms ease-out' }}
              >
                Earn & Track
              </TabsTrigger>
              <TabsTrigger
                value="redeem"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary"
                style={{ transition: 'all 300ms ease-out' }}
              >
                Redeem
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Earn & Track Tab */}
          <TabsContent value="earn" className="space-y-6 px-4 pt-6 pb-8" style={{ transition: 'opacity 300ms ease-out' }}>
            {/* Progress Tracker Hero */}
            <Card className="p-8 mario-shadow-card">
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="h-5 w-5 text-primary" />
                <h2 className="text-card-foreground">Your Rewards Progress</h2>
              </div>

              {/* Circular Progress Ring */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-44 h-44 mb-4">
                  {/* Background ring */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="88"
                      cy="88"
                      r="80"
                      stroke="#E0E0E0"
                      strokeWidth="12"
                      fill="none"
                    />
                    {/* Progress ring with gradient */}
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#79D7BE" />
                        <stop offset="100%" stopColor="#4DA1A9" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="88"
                      cy="88"
                      r="80"
                      stroke="url(#progressGradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${(progressPercent / 100) * 502.4} 502.4`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  {/* Center text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-primary mb-1">{currentPoints.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground text-center px-4">
                      MarioPoints
                    </p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground text-center mb-4">
                  Next milestone {nextMilestone.toLocaleString()} pts (+{pointsNeeded} needed)
                </p>

                {/* Progress Bar */}
                <div className="w-full max-w-xs">
                  <Progress value={progressPercent} className="h-2 mb-2" />
                  <p className="text-xs text-right text-muted-foreground">
                    {Math.round(progressPercent)}%
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 text-primary mario-button-scale"
                >
                  View Milestones <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </Card>

            {/* Tier Summary */}
            <Card className="p-4 mario-shadow-card">
              <div className="flex items-center justify-around mb-3">
                {tiers.map((tier) => (
                  <div
                    key={tier.name}
                    className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                      tier.current
                        ? 'bg-accent/10 border-2 border-accent shadow-lg shadow-accent/20'
                        : 'opacity-50'
                    }`}
                  >
                    <span className="text-2xl mb-1">{tier.icon}</span>
                    <span className="text-xs text-muted-foreground">{tier.name}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-center text-muted-foreground">
                You're {2500 - currentPoints} pts away from Silver Tier
              </p>
            </Card>

            {/* Ways to Earn */}
            <Card className="p-6 mario-shadow-card">
              <h2 className="text-card-foreground mb-4">Ways to Earn More Points</h2>

              <div className="space-y-3">
                {/* Preventive Care */}
                <Collapsible open={preventiveCareOpen} onOpenChange={setPreventiveCareOpen}>
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between py-2 hover:bg-accent/5 px-3 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <Heart className="h-5 w-5 text-primary" />
                        <span className="font-medium text-sm">Preventive Care</span>
                      </div>
                      {preventiveCareOpen ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 mt-2">
                    {preventiveActions.map((action) => (
                      <Card
                        key={action.id}
                        className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleDoAction(action)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <action.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-medium text-sm text-card-foreground">
                                {action.title}
                              </h3>
                              <Badge
                                variant="secondary"
                                className="bg-accent/20 text-accent flex-shrink-0"
                              >
                                +{action.points} pts
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{action.subtitle}</p>
                            {action.progress > 0 && (
                              <Progress value={action.progress} className="h-2 mb-2" />
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-primary p-0 h-auto text-xs mario-button-scale"
                            >
                              Do this now <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                {/* Healthy Habits */}
                <Collapsible open={healthyHabitsOpen} onOpenChange={setHealthyHabitsOpen}>
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between py-2 hover:bg-accent/5 px-3 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <Activity className="h-5 w-5 text-primary" />
                        <span className="font-medium text-sm">Healthy Habits</span>
                      </div>
                      {healthyHabitsOpen ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 mt-2">
                    {habitsActions.map((action) => (
                      <Card
                        key={action.id}
                        className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleDoAction(action)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <action.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-medium text-sm text-card-foreground">
                                {action.title}
                              </h3>
                              <Badge
                                variant="secondary"
                                className="bg-accent/20 text-accent flex-shrink-0"
                              >
                                +{action.points} pts
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{action.subtitle}</p>
                            {action.progress > 0 && (
                              <div className="mb-2">
                                <Progress value={action.progress} className="h-2 mb-1" />
                                {action.completed && (
                                  <p className="text-xs text-support-green">✓ Completed</p>
                                )}
                              </div>
                            )}
                            {!action.completed && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-primary p-0 h-auto text-xs mario-button-scale"
                              >
                                Do this now <ArrowRight className="h-3 w-3 ml-1" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                {/* Health Engagement */}
                <Collapsible open={engagementOpen} onOpenChange={setEngagementOpen}>
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between py-2 hover:bg-accent/5 px-3 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="font-medium text-sm">Health Engagement</span>
                      </div>
                      {engagementOpen ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 mt-2">
                    {engagementActions.map((action) => (
                      <Card
                        key={action.id}
                        className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleDoAction(action)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <action.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-medium text-sm text-card-foreground">
                                {action.title}
                              </h3>
                              <Badge
                                variant="secondary"
                                className="bg-accent/20 text-accent flex-shrink-0"
                              >
                                +{action.points} pts
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{action.subtitle}</p>
                            {action.completed && (
                              <p className="text-xs text-support-green">✓ Completed</p>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </Card>

            {/* Recent Achievements */}
            <Card className="p-6 mario-shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-card-foreground">Recent Achievements</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary text-xs mario-button-scale"
                >
                  View All <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
              <div className="space-y-3">
                {recentAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-support-green/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Gift className="h-4 w-4 text-support-green" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-card-foreground">
                        +{achievement.points} pts
                      </p>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{achievement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Redeem CTA */}
            <Card 
              className="p-6 bg-accent/10 border-accent/20 mario-shadow-card cursor-pointer mario-hover-primary"
              onClick={() => setActiveTab('redeem')}
              style={{ transition: 'all 300ms ease-out' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-medium text-primary">Ready to Redeem?</p>
                    <p className="text-xs text-muted-foreground">See available rewards</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-primary" />
              </div>
            </Card>
          </TabsContent>

          {/* Redeem Tab */}
          <TabsContent value="redeem" className="space-y-6 px-4 pt-6 pb-8" style={{ transition: 'opacity 300ms ease-out' }}>
            {/* Points Balance */}
            <Card className="p-6 mario-shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <div className="text-card-foreground">
                  {currentPoints.toLocaleString()} MarioPoints available
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                You can redeem up to ${Math.floor(currentPoints / 100)} in value today
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary p-0 h-auto text-xs mario-button-scale"
              >
                View Earning History <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Card>

            {/* Featured Rewards */}
            <div className="space-y-3">
              <h3 className="font-medium text-card-foreground px-1">Featured Rewards</h3>
              {availableRewards.map((reward) => (
                <Card
                  key={reward.id}
                  className="p-4 mario-shadow-card hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <reward.icon className="h-6 w-6 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-card-foreground">{reward.title}</h3>
                      <p className="text-xs text-muted-foreground">{reward.description}</p>
                      <p className="text-xs text-primary mt-1">
                        {reward.points.toLocaleString()} pts required
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="flex-shrink-0 mario-button-scale"
                      disabled={!reward.available}
                      onClick={() => setSelectedReward(reward)}
                    >
                      Redeem
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Milestone Rewards */}
            <Card className="p-6 mario-shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="h-5 w-5 text-primary" />
                <h3 className="font-medium text-card-foreground">Silver Tier Reward</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Unlocks at 2,500 pts
              </p>
              <Progress value={50} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">
                You're halfway to your next milestone reward.
              </p>
            </Card>

            {/* Redemption History */}
            <Card className="p-6 mario-shadow-card">
              <h3 className="font-medium text-card-foreground mb-4">Redemption History</h3>
              <div className="space-y-3">
                {redemptionHistory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Gift className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-card-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.points.toLocaleString()} pts • {item.date}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Redemption Modal */}
      <Dialog open={!!selectedReward} onOpenChange={() => setSelectedReward(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Redeem {selectedReward?.title}
            </DialogTitle>
            <DialogDescription className="space-y-2 pt-4">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Reward Value</span>
                <span className="font-medium text-card-foreground">
                  {selectedReward?.value}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Points Required</span>
                <span className="font-medium text-card-foreground">
                  {selectedReward?.points.toLocaleString()} pts
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Your Balance</span>
                <span
                  className={`font-medium ${
                    currentPoints >= (selectedReward?.points || 0)
                      ? 'text-support-green'
                      : 'text-destructive'
                  }`}
                >
                  {currentPoints.toLocaleString()} pts
                </span>
              </div>
              {selectedReward && currentPoints < selectedReward.points && (
                <p className="text-sm text-destructive pt-2">
                  Earn {(selectedReward.points - currentPoints).toLocaleString()} more points to
                  redeem this reward.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setSelectedReward(null)}
              className="flex-1 mario-button-scale"
            >
              Cancel
            </Button>
            <Button
              onClick={() => selectedReward && handleRedeem(selectedReward)}
              disabled={!selectedReward || currentPoints < selectedReward.points}
              className="flex-1 mario-button-scale"
            >
              Redeem Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
