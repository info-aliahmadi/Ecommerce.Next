import { useState, useEffect } from 'react';

// Storage key for expanded navigation groups
const STORAGE_KEY = 'nav_expanded_groups';

/**
 * Custom hook to manage navigation group expansion state with localStorage persistence
 * 
 * @returns {Object} Navigation state management functions and values
 */
export const useNavigationState = () => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  
  // Load expanded groups from localStorage on initial render
  useEffect(() => {
    // Skip during SSR
    if (typeof window === 'undefined') return;
    
    try {
      const storedValue = localStorage.getItem(STORAGE_KEY);
      if (storedValue) {
        setExpandedGroups(JSON.parse(storedValue));
      }
    } catch (error) {
      console.error('Error loading navigation state from localStorage:', error);
    }
  }, []);
  
  // Save to localStorage whenever expanded groups change
  useEffect(() => {
    // Skip during SSR and initial render with empty array
    if (typeof window === 'undefined' || expandedGroups.length === 0) return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expandedGroups));
    } catch (error) {
      console.error('Error saving navigation state to localStorage:', error);
    }
  }, [expandedGroups]);
  
  /**
   * Toggle a navigation group's expanded state
   * 
   * @param {string} groupId - The ID of the navigation group to toggle
   */
  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };
  
  /**
   * Check if a navigation group is expanded
   * 
   * @param {string} groupId - The ID of the navigation group to check
   * @returns {boolean} True if the group is expanded
   */
  const isGroupExpanded = (groupId: string) => {
    return expandedGroups.includes(groupId);
  };
  
  /**
   * Expand a specific navigation group
   * 
   * @param {string} groupId - The ID of the navigation group to expand
   */
  const expandGroup = (groupId: string) => {
    if (!isGroupExpanded(groupId)) {
      setExpandedGroups(prev => [...prev, groupId]);
    }
  };
  
  /**
   * Collapse a specific navigation group
   * 
   * @param {string} groupId - The ID of the navigation group to collapse
   */
  const collapseGroup = (groupId: string) => {
    if (isGroupExpanded(groupId)) {
      setExpandedGroups(prev => prev.filter(id => id !== groupId));
    }
  };
  
  /**
   * Expand all navigation groups
   * 
   * @param {string[]} groupIds - Array of group IDs to expand
   */
  const expandAll = (groupIds: string[]) => {
    setExpandedGroups(groupIds);
  };
  
  /**
   * Collapse all navigation groups
   */
  const collapseAll = () => {
    setExpandedGroups([]);
  };
  
  return {
    expandedGroups,
    toggleGroup,
    isGroupExpanded,
    expandGroup,
    collapseGroup,
    expandAll,
    collapseAll
  };
};

export default useNavigationState; 