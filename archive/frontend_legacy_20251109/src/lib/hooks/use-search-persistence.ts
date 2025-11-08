'use client'

import { useState, useEffect, useCallback } from 'react'

interface SearchState {
  query: string
  filters: Record<string, any>
  tab?: string
}

const SEARCH_STATE_KEY = 'mario-search-state'

export function useSearchPersistence() {
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    filters: {},
    tab: undefined,
  })

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(SEARCH_STATE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSearchState(parsed)
      } catch (e) {
        console.error('Failed to parse saved search state', e)
      }
    }
  }, [])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (searchState.query || Object.keys(searchState.filters).length > 0) {
      localStorage.setItem(SEARCH_STATE_KEY, JSON.stringify(searchState))
    }
  }, [searchState])

  const updateQuery = useCallback((query: string) => {
    setSearchState(prev => ({ ...prev, query }))
  }, [])

  const updateFilters = useCallback((filters: Record<string, any>) => {
    setSearchState(prev => ({ ...prev, filters }))
  }, [])

  const updateTab = useCallback((tab: string) => {
    setSearchState(prev => ({ ...prev, tab }))
  }, [])

  const clearState = useCallback(() => {
    setSearchState({ query: '', filters: {}, tab: undefined })
    localStorage.removeItem(SEARCH_STATE_KEY)
  }, [])

  return {
    searchState,
    updateQuery,
    updateFilters,
    updateTab,
    clearState,
  }
}

