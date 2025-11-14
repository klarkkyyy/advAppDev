import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'custom';

export interface ThemeColors {
  primary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
}

interface ThemeState {
  mode: ThemeMode;
  customColors: ThemeColors;
  accentColor: string;
}

const lightTheme: ThemeColors = {
  primary: '#1DB954',
  background: '#FFFFFF',
  card: '#F5F5F5',
  text: '#000000',
  border: '#E0E0E0',
  notification: '#FF6B6B',
};

const darkTheme: ThemeColors = {
  primary: '#1DB954',
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  border: '#2A2A2A',
  notification: '#FF6B6B',
};

const initialState: ThemeState = {
  mode: 'dark',
  customColors: darkTheme,
  accentColor: '#1DB954',
};

const THEME_STORAGE_KEY = '@theme_settings';

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      if (action.payload === 'light') {
        state.customColors = lightTheme;
      } else if (action.payload === 'dark') {
        state.customColors = darkTheme;
      }
      // When switching to custom, keep current colors (don't reset)
    },
    setCustomColors: (state, action: PayloadAction<Partial<ThemeColors>>) => {
      state.customColors = { ...state.customColors, ...action.payload };
    },
    setAccentColor: (state, action: PayloadAction<string>) => {
      state.accentColor = action.payload;
      state.customColors.primary = action.payload;
    },
    loadThemeFromStorage: (state, action: PayloadAction<ThemeState>) => {
      return action.payload;
    },
  },
});

export const { setThemeMode, setCustomColors, setAccentColor, loadThemeFromStorage } = themeSlice.actions;

// Async actions for storage
export const saveThemeToStorage = (theme: ThemeState) => async () => {
  try {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
  } catch (error) {
    console.error('Failed to save theme:', error);
  }
};

export const loadThemeFromStorageAsync = () => async (dispatch: any) => {
  try {
    const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) {
      dispatch(loadThemeFromStorage(JSON.parse(savedTheme)));
    }
  } catch (error) {
    console.error('Failed to load theme:', error);
  }
};

export const selectTheme = (state: { theme: ThemeState }) => state.theme;
export const selectThemeColors = (state: { theme: ThemeState }) => state.theme.customColors;
export const selectThemeMode = (state: { theme: ThemeState }) => state.theme.mode;
export const selectAccentColor = (state: { theme: ThemeState }) => state.theme.accentColor;

export default themeSlice.reducer;
