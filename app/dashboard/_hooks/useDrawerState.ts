import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openDrawer } from '@root/store/reducers/menu';

// Storage key for drawer state
const STORAGE_KEY = 'drawer_open_state';

// Flag to track if we've loaded from localStorage
let initialized = false;

/**
 * Custom hook to manage drawer state with localStorage persistence
 * 
 * @returns Object with drawer state and management functions
 */
const useDrawerState = () => {
  const dispatch = useDispatch();
  const { drawerOpen } = useSelector((state: any) => state.menu);

  // Load drawer state from localStorage only on first mount
  useEffect(() => {
    // Skip during SSR or if already initialized
    if (typeof window === 'undefined' || initialized) return;
    
    try {
      const storedValue = localStorage.getItem(STORAGE_KEY);
      if (storedValue !== null) {
        const parsedValue = JSON.parse(storedValue);
        dispatch(openDrawer({ drawerOpen: parsedValue }));
      }
      initialized = true;
    } catch (error) {
      console.error('Error loading drawer state from localStorage:', error);
    }
  }, []); // Empty dependency array to run only on mount
  
  // Save to localStorage whenever drawer state changes
  useEffect(() => {
    // Skip during SSR or initial render
    if (typeof window === 'undefined' || !initialized) return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(drawerOpen));
    } catch (error) {
      console.error('Error saving drawer state to localStorage:', error);
    }
  }, [drawerOpen]);

  /**
   * Toggle drawer state
   */
  const toggleDrawer = () => {
    dispatch(openDrawer({ drawerOpen: !drawerOpen }));
  };

  /**
   * Open drawer
   */
  const openDrawerState = () => {
    dispatch(openDrawer({ drawerOpen: true }));
  };

  /**
   * Close drawer
   */
  const closeDrawerState = () => {
    dispatch(openDrawer({ drawerOpen: false }));
  };

  return {
    drawerOpen,
    toggleDrawer,
    openDrawerState,
    closeDrawerState
  };
};

export default useDrawerState; 