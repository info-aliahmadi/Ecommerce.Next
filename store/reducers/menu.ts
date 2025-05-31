// types
'use client';
import { createSlice } from '@reduxjs/toolkit';

// Function to get initial drawer state from localStorage if available
const getInitialDrawerState = (): boolean => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('drawer_open_state');
      if (stored !== null) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading drawer state from localStorage:', e);
    }
  }
  // Default to false if no stored value or not in browser
  return false; 
};

// initial state
const initialState = {
  openItem: ['dashboard'],
  defaultId: 'dashboard',
  openComponent: 'buttons',
  drawerOpen: getInitialDrawerState(),
  componentDrawerOpen: true
};

// ==============================|| SLICE - MENU ||============================== //

const menu = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    activeItem(state, action) {
      state.openItem = action.payload.openItem;
    },

    activeComponent(state, action) {
      state.openComponent = action.payload.openComponent;
    },

    openDrawer(state, action) {
      state.drawerOpen = action.payload.drawerOpen;
    },

    openComponentDrawer(state, action) {
      state.componentDrawerOpen = action.payload.componentDrawerOpen;
    }
  }
});

export default menu.reducer;

export const { activeItem, activeComponent, openDrawer, openComponentDrawer } = menu.actions;
