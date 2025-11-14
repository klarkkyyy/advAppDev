import { Stack } from 'expo-router';
import { PlaylistProvider } from '../contexts/PlaylistContext';

export default function RootLayout() {
  return (
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
  );
}
