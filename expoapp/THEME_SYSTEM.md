# Redux Theme System

This app now features a comprehensive theme management system built with Redux Toolkit, offering users the ability to customize their visual experience with animated transitions.

## Features

### 🎨 Theme Modes
- **Light Mode**: Bright, clean interface with high contrast
- **Dark Mode**: Spotify-inspired dark theme with reduced eye strain
- **Custom Mode**: Fully customizable color scheme

### 🌈 Color Customization
- **Accent Color Picker**: Choose any color for buttons, highlights, and active states
- **Real-time Preview**: See color changes instantly across the entire app
- **Persistent Storage**: Your theme preferences are saved automatically

### ✨ Animated Transitions
- Smooth color transitions using react-native-reanimated
- 300ms fade animations when switching themes
- Interpolated background color changes

## Implementation Details

### Redux Store Structure

```typescript
// store/themeSlice.ts
interface ThemeState {
  mode: 'light' | 'dark' | 'custom';
  customColors: ThemeColors;
  accentColor: string;
}

interface ThemeColors {
  primary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
}
```

### Preset Themes

**Light Theme:**
- Background: #FFFFFF
- Card: #F5F5F5
- Text: #000000
- Border: #E0E0E0

**Dark Theme:**
- Background: #121212
- Card: #1E1E1E
- Text: #FFFFFF
- Border: #2A2A2A

### Usage in Components

```typescript
import { useAppSelector } from '../store/hooks';
import { selectThemeColors, selectAccentColor } from '../store/themeSlice';

const themeColors = useAppSelector(selectThemeColors);
const accentColor = useAppSelector(selectAccentColor);

// Apply to styles
<View style={{ backgroundColor: themeColors.background }}>
  <Text style={{ color: themeColors.text }}>Hello</Text>
  <TouchableOpacity style={{ backgroundColor: accentColor }}>
    <Text>Button</Text>
  </TouchableOpacity>
</View>
```

### Animated Theme Transitions

```typescript
const colorProgress = useSharedValue(0);

useEffect(() => {
  colorProgress.value = withTiming(1, { duration: 300 });
}, [themeColors]);

const animatedStyle = useAnimatedStyle(() => ({
  backgroundColor: themeColors.background,
}));

<Animated.View style={[styles.container, animatedStyle]}>
  {/* Content */}
</Animated.View>
```

## Files Modified

### Core Theme Files
- `store/themeSlice.ts` - Redux slice with theme state and actions
- `store/store.ts` - Redux store configuration
- `store/hooks.ts` - Typed hooks for Redux
- `app/_layout.tsx` - Redux Provider wrapper

### Updated Screens
- `app/(drawer)/settings.tsx` - Theme selector and color picker UI
- `app/(drawer)/home.tsx` - Applied theme colors to masonry grid
- `app/(drawer)/playlists.tsx` - Applied theme to playlist library
- `app/(drawer)/profile.tsx` - Applied theme to profile screen
- `components/BottomNav.tsx` - Dynamic navigation bar colors

## Color Picker

The color picker modal uses `react-native-color-picker` and allows users to:
- Select accent colors using a visual color wheel
- Preview the color in real-time
- Apply changes that persist across app sessions

## AsyncStorage Integration

Theme preferences are automatically saved to AsyncStorage:
- Loads on app startup in `_layout.tsx`
- Saves after every theme change
- Storage key: `@theme_settings`

## Benefits

1. **User Experience**: Personalized interface that matches user preferences
2. **Accessibility**: Light mode option for users who prefer bright interfaces
3. **Consistency**: Single source of truth for colors across the entire app
4. **Performance**: Optimized with React Redux and memoized selectors
5. **Maintainability**: Centralized theme logic makes updates easier

## Future Enhancements

Potential additions:
- System theme detection (auto-switch based on OS settings)
- More preset themes (Ocean, Sunset, Forest, etc.)
- Per-screen color overrides
- Gradient backgrounds
- Font size customization
- High contrast mode for accessibility
