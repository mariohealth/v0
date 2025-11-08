'use client'
import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  ArrowLeft,
  Search,
  MapPin,
  DollarSign,
  Plus,
  Trash2,
  Calculator,
  TrendingUp,
  Shield
} from 'lucide-react';

interface CostEstimate {
  id: string;
  facility: string;
  priceRange: string;
  distance: string;
  inNetwork: boolean;
  rating?: number;
}

interface BudgetItem {
  id: string;
  procedure: string;
  estimatedCost: string;
  facility: string;
}

interface CostEstimatorProps {
  onBack: () => void;
}

export function MarioCostEstimator({ onBack }: CostEstimatorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CostEstimate[]>([]);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    {
      id: '1',
      procedure: 'MRI Knee',
      estimatedCost: 'RM 500',
      facility: 'Gleneagles KL'
    },
    {
      id: '2',
      procedure: 'Dental Cleaning',
      estimatedCost: 'RM 200',
      facility: 'SmileWorks Dental'
    }
  ]);
  const [showScenario, setShowScenario] = useState(false);

  // Mock search results
  const mockResults: CostEstimate[] = [
    {
      id: '1',
      facility: 'Gleneagles KL',
      priceRange: 'RM 480 – RM 520',
      distance: '2.3 km',
      inNetwork: true,
      rating: 4.8
    },
    {
      id: '2',
      facility: 'KPJ Ampang',
      priceRange: 'RM 500 – RM 550',
      distance: '3.1 km',
      inNetwork: true,
      rating: 4.6
    },
    {
      id: '3',
      facility: 'Pantai Hospital',
      priceRange: 'RM 450 – RM 480',
      distance: '5.2 km',
      inNetwork: false,
      rating: 4.5
    }
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSearchResults(mockResults);
    }
  };

  const addToBudget = (result: CostEstimate) => {
    const newItem: BudgetItem = {
      id: Date.now().toString(),
      procedure: searchQuery,
      estimatedCost: result.priceRange.split(' – ')[0],
      facility: result.facility
    };
    setBudgetItems([...budgetItems, newItem]);
  };

  const removeBudgetItem = (id: string) => {
    setBudgetItems(budgetItems.filter(item => item.id !== id));
  };

  const getTotalBudget = () => {
    return budgetItems.reduce((total, item) => {
      const cost = parseInt(item.estimatedCost.replace(/[^\d]/g, ''));
      return total + cost;
    }, 0);
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-background">
      
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card mario-shadow-card">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-semibold">Cost Estimator</h1>
              <p className="text-sm text-muted-foreground">Plan your healthcare expenses</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        
        {/* Search Section */}
        <Card className="p-4">
          <h3 
            className="font-bold mb-4"
            style={{ fontSize: '16px', color: '#1A1A1A' }}
          >
            Search Procedures
          </h3>
          
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="MRI Knee, Blood Test, etc."
                className="pl-10"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
            </div>
            <Button 
              onClick={handleSearch}
              className="text-white"
              style={{ backgroundColor: '#2E5077' }}
            >
              Search
            </Button>
          </div>
        </Card>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Card className="p-4">
            <h3 
              className="font-bold mb-4"
              style={{ fontSize: '16px', color: '#1A1A1A' }}
            >
              Results for "{searchQuery}"
            </h3>
            
            <div className="space-y-3">
              {searchResults.map((result) => (
                <Card key={result.id} className="p-4 mario-transition mario-hover-primary">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{result.facility}</h4>
                        {result.inNetwork && (
                          <Badge 
                            variant="outline"
                            className="text-xs"
                            style={{ 
                              borderColor: '#79D7BE',
                              color: '#79D7BE',
                              backgroundColor: '#79D7BE10'
                            }}
                          >
                            In-Network
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span>{result.priceRange}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{result.distance}</span>
                        </div>
                        {result.rating && (
                          <div className="flex items-center gap-1">
                            <span>⭐</span>
                            <span>{result.rating.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addToBudget(result)}
                      className="ml-4"
                      style={{ borderColor: '#2E5077', color: '#2E5077' }}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add to Budget
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {/* Upcoming Budget */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 
              className="font-bold"
              style={{ fontSize: '16px', color: '#1A1A1A' }}
            >
              Upcoming Budget
            </h3>
            <div 
              className="text-xl font-bold"
              style={{ color: '#2E5077' }}
            >
              RM {getTotalBudget().toLocaleString()}
            </div>
          </div>
          
          <div className="space-y-3">
            {budgetItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{item.procedure}</p>
                  <p className="text-xs text-muted-foreground">{item.facility}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.estimatedCost}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBudgetItem(item.id)}
                    className="p-1 h-6 w-6"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            
            {budgetItems.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No items in your budget yet. Search for procedures above to add them.
              </p>
            )}
          </div>
        </Card>

        {/* Deductible Impact */}
        {budgetItems.length > 0 && (
          <Card className="p-4">
            <h3 
              className="font-bold mb-4"
              style={{ fontSize: '16px', color: '#1A1A1A' }}
            >
              Deductible Impact
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current deductible met:</span>
                <span className="font-medium">$850 / $2,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Planned expenses:</span>
                <span className="font-medium">RM {getTotalBudget().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm border-t pt-2">
                <span className="font-medium">After planned expenses:</span>
                <span 
                  className="font-bold"
                  style={{ color: '#2E5077' }}
                >
                  Deductible likely met
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Scenario Simulator CTA */}
        <Button
          variant="outline"
          onClick={() => setShowScenario(!showScenario)}
          className="w-full justify-center"
          style={{ borderColor: '#4DA1A9', color: '#4DA1A9' }}
        >
          <Calculator className="h-4 w-4 mr-2" />
          Scenario Simulator
        </Button>

        {/* Scenario Simulator */}
        {showScenario && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h4 className="font-medium mb-3 text-center">This Year</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Remaining deductible:</span>
                  <span>$1,150</span>
                </div>
                <div className="flex justify-between">
                  <span>Out-of-pocket max:</span>
                  <span>$5,000</span>
                </div>
                <div className="flex justify-between text-primary font-medium">
                  <span>Estimated cost:</span>
                  <span>~$800</span>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <h4 className="font-medium mb-3 text-center">Next Year</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Fresh deductible:</span>
                  <span>$2,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Out-of-pocket max:</span>
                  <span>$5,000</span>
                </div>
                <div className="flex justify-between text-accent font-medium">
                  <span>Estimated cost:</span>
                  <span>~$1,200</span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}