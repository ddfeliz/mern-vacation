// src/store.ts
import { configureStore } from '@reduxjs/toolkit'; 
import authReducer from './slices/authSlice';

// Configuration du store Redux avec les reducers
const store = configureStore({
  reducer: {
    // Le reducer pour gérer l'authentification
    auth: authReducer, 
  },
});

// Définition du type RootState en utilisant la méthode ReturnType
// Ce type sera utilisé pour accéder à l'état global dans vos composants
export type RootState = ReturnType<typeof store.getState>;

// Export du store configuré
export default store;

