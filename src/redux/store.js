import { configureStore } from '@reduxjs/toolkit';
import progressReducer from './progressSlice';

const store = configureStore({
  reducer: {
    progress: progressReducer,
  },
});

export default store;
