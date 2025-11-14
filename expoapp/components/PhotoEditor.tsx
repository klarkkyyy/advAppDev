import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Dimensions, Alert, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import * as ImageManipulator from 'expo-image-manipulator';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PREVIEW_SIZE = SCREEN_WIDTH - 40;

interface PhotoEditorProps {
  visible: boolean;
  imageUri: string;
  onClose: () => void;
  onSave: (uri: string) => void;
  accentColor: string;
  themeColors: any;
}

type FilterType = 'none' | 'grayscale' | 'sepia';
type EditorMode = 'normal' | 'cropping';

export default function PhotoEditor({ visible, imageUri, onClose, onSave, accentColor, themeColors }: PhotoEditorProps) {
  const [filter, setFilter] = useState<FilterType>('none');
  const [filterIntensity, setFilterIntensity] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [editedUri, setEditedUri] = useState(imageUri);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [mode, setMode] = useState<EditorMode>('normal');
  const [cropRegion, setCropRegion] = useState({ x: 0, y: 0, width: 200, height: 200 });

  // Reset state when new image is opened
  React.useEffect(() => {
    if (visible && imageUri) {
      console.log('PhotoEditor opened with image:', imageUri);
      setFilter('none');
      setFilterIntensity(1);
      setRotation(0);
      setEditedUri(imageUri);
      setMode('normal');
      
      // Get image dimensions
      Image.getSize(imageUri, (width, height) => {
        setImageSize({ width, height });
        
        // Initialize crop region to center of image
        const initialSize = Math.min(width, height) * 0.8;
        const scale = PREVIEW_SIZE / Math.max(width, height);
        const displayWidth = width * scale;
        const displayHeight = height * scale;
        
        setCropRegion({
          x: (displayWidth - initialSize * scale) / 2,
          y: (displayHeight - initialSize * scale) / 2,
          width: initialSize * scale,
          height: initialSize * scale,
        });
      }, (error) => {
        console.error('Failed to get image size:', error);
      });
    }
  }, [visible, imageUri]);

  const applyTransformations = async () => {
    try {
      let actions: any[] = [];

      // Apply rotation
      if (rotation !== 0) {
        actions.push({ rotate: rotation });
      }

      if (actions.length > 0) {
        const result = await ImageManipulator.manipulateAsync(
          imageUri,
          actions,
          { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
        );
        setEditedUri(result.uri);
      } else {
        setEditedUri(imageUri);
      }
    } catch (error) {
      console.error('Failed to apply transformations:', error);
      Alert.alert('Error', 'Failed to apply transformations');
    }
  };

  React.useEffect(() => {
    applyTransformations();
  }, [rotation]);

  const handleCrop = async () => {
    if (mode === 'normal') {
      // Enter crop mode
      setMode('cropping');
      return;
    }

    // Apply crop
    try {
      if (imageSize.width === 0 || imageSize.height === 0) {
        Alert.alert('Error', 'Unable to determine image dimensions');
        return;
      }

      // Convert display coordinates to actual image coordinates
      const scale = Math.max(imageSize.width, imageSize.height) / PREVIEW_SIZE;
      const displayScale = PREVIEW_SIZE / Math.max(imageSize.width, imageSize.height);
      
      const actualX = Math.floor(cropRegion.x / displayScale);
      const actualY = Math.floor(cropRegion.y / displayScale);
      const actualWidth = Math.floor(cropRegion.width / displayScale);
      const actualHeight = Math.floor(cropRegion.height / displayScale);

      // Ensure crop is within bounds
      const cropX = Math.max(0, Math.min(actualX, imageSize.width - actualWidth));
      const cropY = Math.max(0, Math.min(actualY, imageSize.height - actualHeight));
      const cropW = Math.min(actualWidth, imageSize.width - cropX);
      const cropH = Math.min(actualHeight, imageSize.height - cropY);

      const result = await ImageManipulator.manipulateAsync(
        editedUri,
        [
          {
            crop: {
              originX: cropX,
              originY: cropY,
              width: cropW,
              height: cropH,
            },
          },
        ],
        { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
      );
      setEditedUri(result.uri);
      
      // Update image size and reset crop region
      setImageSize({ width: cropW, height: cropH });
      const newScale = PREVIEW_SIZE / Math.max(cropW, cropH);
      setCropRegion({
        x: 0,
        y: 0,
        width: cropW * newScale,
        height: cropH * newScale,
      });
      setMode('normal');
    } catch (error) {
      console.error('Failed to crop:', error);
      Alert.alert('Error', 'Failed to crop image. Please try again.');
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleSave = () => {
    console.log('PhotoEditor saving with URI:', editedUri);
    onSave(editedUri);
    onClose();
  };

  const handleReset = () => {
    setFilter('none');
    setFilterIntensity(1);
    setRotation(0);
    setEditedUri(imageUri);
    setMode('normal');
  };

  const handleCancelCrop = () => {
    setMode('normal');
  };

  // Track initial position for dragging
  const dragStart = React.useRef({ x: 0, y: 0 });
  const initialCropRegion = React.useRef({ x: 0, y: 0, width: 0, height: 0 });

  // Pan responder for dragging crop box
  const panResponder = React.useMemo(
    () => PanResponder.create({
      onStartShouldSetPanResponder: () => mode === 'cropping',
      onMoveShouldSetPanResponder: () => mode === 'cropping',
      onPanResponderGrant: () => {
        initialCropRegion.current = { ...cropRegion };
      },
      onPanResponderMove: (_, gestureState) => {
        if (mode !== 'cropping') return;
        
        const scale = PREVIEW_SIZE / Math.max(imageSize.width, imageSize.height);
        const maxX = imageSize.width * scale - initialCropRegion.current.width;
        const maxY = imageSize.height * scale - initialCropRegion.current.height;
        
        const newX = Math.max(0, Math.min(initialCropRegion.current.x + gestureState.dx, maxX));
        const newY = Math.max(0, Math.min(initialCropRegion.current.y + gestureState.dy, maxY));
        
        setCropRegion(prev => ({
          ...prev,
          x: newX,
          y: newY,
        }));
      },
    }),
    [mode, cropRegion, imageSize]
  );

  // Create pan responders for each corner
  const createCornerPanResponder = (corner: 'tl' | 'tr' | 'bl' | 'br') => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        initialCropRegion.current = { ...cropRegion };
      },
      onPanResponderMove: (_, gestureState) => {
        const scale = PREVIEW_SIZE / Math.max(imageSize.width, imageSize.height);
        const maxWidth = imageSize.width * scale;
        const maxHeight = imageSize.height * scale;
        const minSize = 50;
        
        let newRegion = { ...initialCropRegion.current };
        
        switch (corner) {
          case 'tl':
            const newTLX = Math.max(0, Math.min(initialCropRegion.current.x + gestureState.dx, initialCropRegion.current.x + initialCropRegion.current.width - minSize));
            const newTLY = Math.max(0, Math.min(initialCropRegion.current.y + gestureState.dy, initialCropRegion.current.y + initialCropRegion.current.height - minSize));
            newRegion.x = newTLX;
            newRegion.y = newTLY;
            newRegion.width = initialCropRegion.current.width + (initialCropRegion.current.x - newTLX);
            newRegion.height = initialCropRegion.current.height + (initialCropRegion.current.y - newTLY);
            break;
          case 'tr':
            const newTRY = Math.max(0, Math.min(initialCropRegion.current.y + gestureState.dy, initialCropRegion.current.y + initialCropRegion.current.height - minSize));
            newRegion.y = newTRY;
            newRegion.width = Math.max(minSize, Math.min(initialCropRegion.current.width + gestureState.dx, maxWidth - initialCropRegion.current.x));
            newRegion.height = initialCropRegion.current.height + (initialCropRegion.current.y - newTRY);
            break;
          case 'bl':
            const newBLX = Math.max(0, Math.min(initialCropRegion.current.x + gestureState.dx, initialCropRegion.current.x + initialCropRegion.current.width - minSize));
            newRegion.x = newBLX;
            newRegion.width = initialCropRegion.current.width + (initialCropRegion.current.x - newBLX);
            newRegion.height = Math.max(minSize, Math.min(initialCropRegion.current.height + gestureState.dy, maxHeight - initialCropRegion.current.y));
            break;
          case 'br':
            newRegion.width = Math.max(minSize, Math.min(initialCropRegion.current.width + gestureState.dx, maxWidth - initialCropRegion.current.x));
            newRegion.height = Math.max(minSize, Math.min(initialCropRegion.current.height + gestureState.dy, maxHeight - initialCropRegion.current.y));
            break;
        }
        
        setCropRegion(newRegion);
      },
    });
  };

  const cornerTL = React.useMemo(() => createCornerPanResponder('tl'), [cropRegion, imageSize]);
  const cornerTR = React.useMemo(() => createCornerPanResponder('tr'), [cropRegion, imageSize]);
  const cornerBL = React.useMemo(() => createCornerPanResponder('bl'), [cropRegion, imageSize]);
  const cornerBR = React.useMemo(() => createCornerPanResponder('br'), [cropRegion, imageSize]);

  // Get filter style for preview
  const getFilterStyle = () => {
    if (filter === 'none') return {};
    
    // Note: CSS filters don't work in React Native, so we show a visual indicator
    // The actual filter would need to be applied server-side or with a different library
    return {};
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: themeColors.border }]}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={28} color={themeColors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: themeColors.text }]}>Edit Photo</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={[styles.saveText, { color: accentColor }]}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Image Preview */}
        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <Image 
              source={{ uri: editedUri }} 
              style={[
                styles.image,
                filter === 'grayscale' && { opacity: 0.8 },
                filter === 'sepia' && { tintColor: '#704214' }
              ]} 
              resizeMode="contain" 
            />
            {filter !== 'none' && (
              <View style={styles.filterOverlay}>
                <View style={[
                  styles.filterIndicator,
                  { 
                    backgroundColor: filter === 'grayscale' ? 'rgba(128,128,128,0.3)' : 'rgba(112,66,20,0.3)',
                    opacity: filterIntensity 
                  }
                ]} />
              </View>
            )}
            
            {/* Crop Overlay */}
            {mode === 'cropping' && (
              <View style={styles.cropOverlay}>
                {/* Darkened areas outside crop */}
                <View style={[styles.cropDarken, { height: cropRegion.y }]} />
                <View style={styles.cropRow}>
                  <View style={[styles.cropDarken, { width: cropRegion.x }]} />
                  <View 
                    style={[
                      styles.cropBox,
                      {
                        left: cropRegion.x,
                        top: cropRegion.y,
                        width: cropRegion.width,
                        height: cropRegion.height,
                        borderColor: accentColor,
                      }
                    ]}
                    {...panResponder.panHandlers}
                  >
                    {/* Corner handles */}
                    <View 
                      style={[styles.cornerHandle, styles.cornerTL, { backgroundColor: accentColor }]}
                      {...cornerTL.panHandlers}
                    />
                    <View 
                      style={[styles.cornerHandle, styles.cornerTR, { backgroundColor: accentColor }]}
                      {...cornerTR.panHandlers}
                    />
                    <View 
                      style={[styles.cornerHandle, styles.cornerBL, { backgroundColor: accentColor }]}
                      {...cornerBL.panHandlers}
                    />
                    <View 
                      style={[styles.cornerHandle, styles.cornerBR, { backgroundColor: accentColor }]}
                      {...cornerBR.panHandlers}
                    />
                  </View>
                  <View style={[styles.cropDarken, { flex: 1 }]} />
                </View>
                <View style={[styles.cropDarken, { flex: 1 }]} />
              </View>
            )}
          </View>
          
          {mode === 'cropping' && (
            <Text style={[styles.cropHint, { color: themeColors.text }]}>
              Drag to move • Drag corners to resize
            </Text>
          )}
        </View>

        {/* Filter Selection */}
        <View style={[styles.section, { borderTopColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Filters</Text>
          <Text style={[styles.filterNote, { color: themeColors.subtext }]}>
            Note: Advanced filters require additional libraries like expo-gl or react-native-image-filter-kit
          </Text>
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                { borderColor: themeColors.border },
                filter === 'none' && { backgroundColor: accentColor, borderColor: accentColor },
              ]}
              onPress={() => setFilter('none')}
            >
              <Text style={[styles.filterText, { color: filter === 'none' ? '#FFFFFF' : themeColors.text }]}>
                None
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                { borderColor: themeColors.border },
                filter === 'grayscale' && { backgroundColor: accentColor, borderColor: accentColor },
              ]}
              onPress={() => setFilter('grayscale')}
            >
              <Text style={[styles.filterText, { color: filter === 'grayscale' ? '#FFFFFF' : themeColors.text }]}>
                Grayscale
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                { borderColor: themeColors.border },
                filter === 'sepia' && { backgroundColor: accentColor, borderColor: accentColor },
              ]}
              onPress={() => setFilter('sepia')}
            >
              <Text style={[styles.filterText, { color: filter === 'sepia' ? '#FFFFFF' : themeColors.text }]}>
                Sepia
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Editing Tools */}
        <View style={[styles.section, { borderTopColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Tools</Text>
          <View style={styles.toolsRow}>
            <TouchableOpacity
              style={[styles.toolButton, { borderColor: themeColors.border }]}
              onPress={handleRotate}
            >
              <Ionicons name="refresh" size={24} color={accentColor} />
              <Text style={[styles.toolText, { color: themeColors.text }]}>Rotate</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toolButton, 
                { borderColor: themeColors.border },
                mode === 'cropping' && { backgroundColor: accentColor }
              ]}
              onPress={handleCrop}
            >
              <Ionicons 
                name={mode === 'cropping' ? 'checkmark' : 'crop'} 
                size={24} 
                color={mode === 'cropping' ? '#FFFFFF' : accentColor} 
              />
              <Text style={[styles.toolText, { color: mode === 'cropping' ? '#FFFFFF' : themeColors.text }]}>
                {mode === 'cropping' ? 'Apply' : 'Crop'}
              </Text>
            </TouchableOpacity>

            {mode === 'cropping' ? (
              <TouchableOpacity
                style={[styles.toolButton, { borderColor: themeColors.border }]}
                onPress={handleCancelCrop}
              >
                <Ionicons name="close" size={24} color={accentColor} />
                <Text style={[styles.toolText, { color: themeColors.text }]}>Cancel</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.toolButton, { borderColor: themeColors.border }]}
                onPress={handleReset}
              >
                <Ionicons name="reload" size={24} color={accentColor} />
                <Text style={[styles.toolText, { color: themeColors.text }]}>Reset</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    paddingTop: 50,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageWrapper: {
    position: 'relative',
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    borderRadius: 20,
  },
  filterOverlay: {
    position: 'absolute',
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    borderRadius: 20,
    overflow: 'hidden',
  },
  filterIndicator: {
    width: '100%',
    height: '100%',
  },
  cropOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    justifyContent: 'flex-start',
  },
  cropRow: {
    flexDirection: 'row',
    height: 0,
  },
  cropDarken: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  cropBox: {
    position: 'absolute',
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  cornerHandle: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  cornerTL: {
    top: -10,
    left: -10,
  },
  cornerTR: {
    top: -10,
    right: -10,
  },
  cornerBL: {
    bottom: -10,
    left: -10,
  },
  cornerBR: {
    bottom: -10,
    right: -10,
  },
  cropHint: {
    marginTop: 10,
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  section: {
    padding: 16,
    borderTopWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  filterNote: {
    fontSize: 12,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  intensityValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  toolsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  toolButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    gap: 6,
  },
  toolText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
