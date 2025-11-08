'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTotalPoints, getRewardHistory, type RewardEvent } from '@/lib/rewards';

interface MarioPointsContextType {
  points: number;
  history: RewardEvent[];
  refresh: () => void;
}

const MarioPointsContext = createContext<MarioPointsContextType | undefined>(undefined);

export function MarioPointsProvider({ children }: { children: React.ReactNode }) {
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState<RewardEvent[]>([]);

  const refresh = () => {
    setPoints(getTotalPoints());
    setHistory(getRewardHistory());
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <MarioPointsContext.Provider value={{ points, history, refresh }}>
      {children}
    </MarioPointsContext.Provider>
  );
}

export function useMarioPoints() {
  const context = useContext(MarioPointsContext);
  if (!context) {
    // Return default values if context is not available
    return {
      points: getTotalPoints(),
      history: getRewardHistory(),
      refresh: () => {},
    };
  }
  return context;
}

