# Photo Editor Feature Documentation

## Overview
The Photo Editor component provides comprehensive image editing capabilities for profile pictures with real-time preview, filters, and transformation tools.

## Features

### 1. **Real-Time Filters**
- **Grayscale Filter**: Converts image to black and white with adjustable intensity
- **Sepia Filter**: Applies warm vintage tone with adjustable intensity
- **None**: Original image without filters

### 2. **Filter Intensity Control**
- Smooth slider from 0% to 100%
- Real-time preview updates
- Display current intensity percentage
- Smooth interpolation between original and filtered states

### 3. **Editing Tools**
- **Rotate**: 90-degree clockwise rotation with cumulative effect
- **Crop**: Center crop to 400x400px square
- **Reset**: Restore to original image state

### 4. **Save & Export**
- JPEG format with 90% compression
- Maintains edited state on save
- Returns URI to parent component

## Technical Implementation

### Color Matrix Filters

#### Grayscale Filter
```typescript
const intensity = filterIntensity;
const invIntensity = 1 - intensity;
colorMatrix: [
  0.299 * intensity + invIntensity, 0.587 * intensity, 0.114 * intensity, 0, 0,
  0.299 * intensity, 0.587 * intensity + invIntensity, 0.114 * intensity, 0, 0,
  0.299 * intensity, 0.587 * intensity, 0.114 * intensity + invIntensity, 0, 0,
  0, 0, 0, 1, 0,
]
```

#### Sepia Filter
```typescript
const intensity = filterIntensity;
const invIntensity = 1 - intensity;
colorMatrix: [
  0.393 * intensity + invIntensity, 0.769 * intensity, 0.189 * intensity, 0, 0,
  0.349 * intensity, 0.686 * intensity + invIntensity, 0.168 * intensity, 0, 0,
  0.272 * intensity, 0.534 * intensity, 0.131 * intensity + invIntensity, 0, 0,
  0, 0, 0, 1, 0,
]
```

The intensity calculation blends between identity matrix (original) and filter matrix for smooth transitions.

### Component Architecture

#### PhotoEditor.tsx
```typescript
interface PhotoEditorProps {
  visible: boolean;          // Modal visibility state
  imageUri: string;          // Source image URI
  onClose: () => void;       // Close handler
  onSave: (uri: string) => void;  // Save handler with edited URI
  accentColor: string;       // Theme accent color
  themeColors: any;          // Complete theme colors
}
```

#### State Management
- `filter`: Current filter type ('none' | 'grayscale' | 'sepia')
- `filterIntensity`: Filter strength (0 to 1)
- `rotation`: Cumulative rotation in degrees (0, 90, 180, 270)
- `editedUri`: Current edited image URI

### Integration with Profile Screen

#### Updated Flow
1. User selects camera/gallery
2. Image picker returns full-resolution image (no editing)
3. PhotoEditor modal opens with selected image
4. User applies filters, rotates, crops
5. User saves edited image
6. Profile image updates with edited URI

#### Key Changes
- Removed `allowsEditing` from ImagePicker
- Added `selectedImageUri` state for temporary storage
- Added `showPhotoEditor` state for modal control
- Created `handlePhotoEditorSave` callback

## Usage

### Opening Editor
```typescript
const [showPhotoEditor, setShowPhotoEditor] = useState(false);
const [selectedImageUri, setSelectedImageUri] = useState("");

// After picking image
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: false,  // Disable built-in editor
  quality: 1,
});

if (!result.canceled && result.assets[0]) {
  setSelectedImageUri(result.assets[0].uri);
  setShowPhotoEditor(true);
}
```

### Handling Save
```typescript
const handlePhotoEditorSave = (uri: string) => {
  setProfileImage(uri);  // Update profile with edited image
  setShowPhotoEditor(false);
};
```

### Rendering Component
```typescript
<PhotoEditor
  visible={showPhotoEditor}
  imageUri={selectedImageUri}
  onClose={() => setShowPhotoEditor(false)}
  onSave={handlePhotoEditorSave}
  accentColor={accentColor}
  themeColors={themeColors}
/>
```

## Dependencies
- `expo-image-manipulator`: Core image manipulation API
- `@react-native-community/slider`: Filter intensity slider
- `react-native-reanimated`: Smooth animations (inherited from parent)

## File Locations
- Component: `expoapp/components/PhotoEditor.tsx`
- Integration: `expoapp/app/(drawer)/profile.tsx`
- Documentation: `expoapp/PHOTO_EDITOR.md`

## Performance Considerations
- Filter application is async with try-catch error handling
- Uses `React.useEffect` to auto-apply filters on state change
- JPEG compression at 90% for optimal file size
- Real-time preview updates with smooth slider interaction

## Future Enhancements
- Advanced crop with custom aspect ratios
- Brightness/contrast adjustments
- Blur and sharpen filters
- Stickers and text overlays
- Undo/redo stack
- Free-form rotation (not just 90-degree increments)
- Zoom and pan controls
