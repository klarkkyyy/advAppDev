import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { PlaylistProvider } from '../contexts/PlaylistContext';
import { ProfileProvider } from '../contexts/ProfileContext';
import { useEffect } from 'react';
import { loadThemeFromStorageAsync } from '../store/themeSlice';

export default function RootLayout() {
  useEffect(() => {
    store.dispatch(loadThemeFromStorageAsync() as any);
  }, []);

  return (
    <Provider store={store}>
      <ProfileProvider>
        <PlaylistProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              presentation: 'transparentModal',
              gestureEnabled: true,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
            <Stack.Screen
              name="playlist-detail"
              options={{
                animation: 'slide_from_right',
                gestureEnabled: true,
              }}
            />
            <Stack.Screen name="(drawer)" />
          </Stack>
        </PlaylistProvider>
      </ProfileProvider>
    </Provider>
  );
}
