import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/model';
import { roomsReducer } from '../../features/rooms/model';
import { chatReducer } from '../../features/chat/model';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    rooms: roomsReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;