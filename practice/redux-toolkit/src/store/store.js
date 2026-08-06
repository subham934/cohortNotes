import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './CounterSlice.jsx';
import themeReducer from './ThemeSlice.jsx';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    theme: themeReducer,
  },
});
