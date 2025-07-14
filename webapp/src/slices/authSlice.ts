// src/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Définition de l'interface pour l'état d'authentification
interface AuthState {
  isAuthenticated: boolean;
}

// Chargement de l'état initial depuis localStorage
const initialState: AuthState = {
  isAuthenticated: JSON.parse(localStorage.getItem('isAuthenticated') || 'false'), // Vérifie localStorage pour savoir si l'utilisateur est authentifié
};

// Création du slice d'authentification
const authSlice = createSlice({
  name: 'auth', // Nom du slice
  initialState, // État initial
  reducers: {
    // Action de connexion
    login: (state) => {
      state.isAuthenticated = true;
      localStorage.setItem('isAuthenticated', 'true'); // Sauvegarde dans localStorage
    },
    // Action de déconnexion
    logout: (state) => {
      state.isAuthenticated = false;
      localStorage.setItem('isAuthenticated', 'false'); // Sauvegarde dans localStorage
    },
    // Action de mise à jour de l'état d'authentification, au besoin
    setAuthenticationStatus: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
      localStorage.setItem('isAuthenticated', JSON.stringify(action.payload)); // Sauvegarde dans localStorage
    },
  },
});

// Export des actions
export const { login, logout, setAuthenticationStatus } = authSlice.actions;

// Export du reducer
export default authSlice.reducer;
