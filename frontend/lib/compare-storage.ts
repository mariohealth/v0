/**
 * Compare Selection Storage
 * 
 * Handles localStorage for selected procedures to compare
 */

const COMPARE_SELECTION_KEY = 'compareSelection';
const MAX_COMPARE_ITEMS = 5;

export interface CompareItem {
  id: string;
  name: string;
  category?: string;
}

/**
 * Get compare selection from localStorage
 */
export function getCompareSelection(): CompareItem[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(COMPARE_SELECTION_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.slice(0, MAX_COMPARE_ITEMS) : [];
  } catch (error) {
    console.error('Failed to parse compare selection:', error);
    return [];
  }
}

/**
 * Save compare selection to localStorage
 */
export function saveCompareSelection(items: CompareItem[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    // Limit to max items
    const limited = items.slice(0, MAX_COMPARE_ITEMS);
    localStorage.setItem(COMPARE_SELECTION_KEY, JSON.stringify(limited));
  } catch (error) {
    console.error('Failed to save compare selection:', error);
  }
}

/**
 * Add item to compare selection
 */
export function addToCompare(item: CompareItem): boolean {
  const current = getCompareSelection();
  
  // Check if already in selection
  if (current.some(i => i.id === item.id)) {
    return false;
  }
  
  // Check if at max
  if (current.length >= MAX_COMPARE_ITEMS) {
    return false;
  }
  
  const updated = [...current, item];
  saveCompareSelection(updated);
  return true;
}

/**
 * Remove item from compare selection
 */
export function removeFromCompare(itemId: string): void {
  const current = getCompareSelection();
  const updated = current.filter(item => item.id !== itemId);
  saveCompareSelection(updated);
}

/**
 * Clear compare selection
 */
export function clearCompareSelection(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(COMPARE_SELECTION_KEY);
  } catch (error) {
    console.error('Failed to clear compare selection:', error);
  }
}

