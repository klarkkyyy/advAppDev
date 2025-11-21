import { ComponentProps, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import MapView, {
  Circle,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useAppSelector } from "../../store/hooks";
import { selectThemeColors, selectThemeMode } from "../../store/themeSlice";

type Poi = {
  id: string;
  title: string;
  description: string;
  coordinate: { latitude: number; longitude: number };
  radius: number;
  color: string;
};

const POIS: Poi[] = [
  {
    id: "cat-cafe-cebu",
    title: "Neko Cat Café Cebu",
    description: "Cat café in IT Park, Cebu City",
    coordinate: { latitude: 10.3181, longitude: 123.9058 },
    radius: 150,
    color: "#FF6EC7",
  },
  {
    id: "cebu-vet-cat",
    title: "Cebu Pet Veterinary Clinic",
    description: "Full-service veterinary clinic",
    coordinate: { latitude: 10.3157, longitude: 123.8854 },
    radius: 100,
    color: "#1DB954",
  },
  {
    id: "talisay-animal-shelter",
    title: "Talisay Animal Welfare",
    description: "Cat & dog shelter in Talisay",
    coordinate: { latitude: 10.2451, longitude: 123.8495 },
    radius: 200,
    color: "#F8D66D",
  },
  {
    id: "cats-of-cebu",
    title: "Cats of Cebu Rescue",
    description: "Cat rescue & adoption center",
    coordinate: { latitude: 10.3300, longitude: 123.9100 },
    radius: 150,
    color: "#9B59B6",
  },
  {
    id: "pawfect-cebu",
    title: "Pawfect Pet Shop & Café",
    description: "Pet shop with cat area",
    coordinate: { latitude: 10.2900, longitude: 123.8600 },
    radius: 120,
    color: "#E74C3C",
  },
];

const defaultRegion: Region = {
  latitude: POIS[0].coordinate.latitude,
  longitude: POIS[0].coordinate.longitude,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

// Get device dimensions for responsive design
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 768;
const isLargeDevice = SCREEN_WIDTH >= 1024;

export default function MapDashboard() {
  const router = useRouter();
  const navigation = useNavigation();
  const themeColors = useAppSelector(selectThemeColors);
  const themeMode = useAppSelector(selectThemeMode);
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>(defaultRegion);
  const [userCoords, setUserCoords] =
    useState<Location.LocationObjectCoords | null>(null);
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'terrain'>('standard');
  const [isLegendExpanded, setIsLegendExpanded] = useState(false);
  const [selectedPoi, setSelectedPoi] = useState<Poi>(POIS[0]);
  const [isGeofencingActive, setIsGeofencingActive] = useState(false);
  const [mapStyleTheme, setMapStyleTheme] = useState<'standard' | 'dark' | 'retro' | 'high-contrast'>('standard');
  const [showThemePicker, setShowThemePicker] = useState(false);
  const legendAnimation = useRef(new Animated.Value(0)).current;
  const geofenceState = useRef<Record<string, boolean>>({});
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  const isDarkMode = themeMode === "dark";
  const mapStyle = useMemo(() => {
    if (mapStyleTheme === 'dark') return darkMapStyle;
    if (mapStyleTheme === 'retro') return retroMapStyle;
    if (mapStyleTheme === 'high-contrast') return highContrastMapStyle;
    return []; // standard
  }, [mapStyleTheme]);
  const mutedTextColor = useMemo(
    () => `${themeColors.text}B3`,
    [themeColors.text]
  );
  const buttonColors = isDarkMode
    ? { background: "#FFFFFF", foreground: "#000" }
    : { background: "#E8E8E8", foreground: "#000" };

  // Calculate distance between two coordinates in meters
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Check geofences and trigger alerts
  const checkGeofences = (latitude: number, longitude: number) => {
    POIS.forEach((poi) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        poi.coordinate.latitude,
        poi.coordinate.longitude
      );

      const isInside = distance <= poi.radius;
      const wasInside = geofenceState.current[poi.id] || false;

      if (isInside && !wasInside) {
        // Entered geofence
        geofenceState.current[poi.id] = true;
        Alert.alert(
          "📍 Entered Zone",
          `You are now near ${poi.title}! (${Math.round(distance)}m away)`,
          [{ text: "OK" }]
        );
      } else if (!isInside && wasInside) {
        // Exited geofence
        geofenceState.current[poi.id] = false;
        Alert.alert(
          "👋 Left Zone",
          `You have left ${poi.title}`,
          [{ text: "OK" }]
        );
      }
    });
  };

  const getUserLocation = async (centerMap = false) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          "Location needed",
          "Enable location access to show nearby checkpoints."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced, // Changed from High for faster response
        maximumAge: 10000, // Accept cached location up to 10 seconds old
      });
      
      setUserCoords(location.coords);
      
      // Only center map if explicitly requested
      if (centerMap && mapRef.current) {
        const newRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(newRegion);
        mapRef.current.animateToRegion(newRegion, 300); // Faster animation
      }
    } catch (error) {
      Alert.alert("Location Error", "Could not get your location. Please try again.");
    }
  };

  // Start geofencing monitoring
  const startGeofencing = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          "Permission Required",
          "Location permission is needed for geofencing."
        );
        return;
      }

      // Start watching location with platform-optimized settings
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Platform.select({
            ios: Location.Accuracy.High,
            android: Location.Accuracy.Balanced, // Better battery on Android
          }) as Location.LocationAccuracy,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 10, // Or when moved 10 meters
        },
        (location) => {
          setUserCoords(location.coords);
          checkGeofences(location.coords.latitude, location.coords.longitude);
        }
      );

      locationSubscription.current = subscription;
      setIsGeofencingActive(true);
      
      Alert.alert(
        "✅ Geofencing Active",
        "You'll receive alerts when entering or leaving cat-friendly zones!"
      );
    } catch (error) {
      Alert.alert("Error", "Could not start geofencing.");
    }
  };

  // Stop geofencing monitoring
  const stopGeofencing = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
      setIsGeofencingActive(false);
      geofenceState.current = {}; // Reset all geofence states
      
      Alert.alert(
        "🛑 Geofencing Stopped",
        "Location monitoring has been disabled."
      );
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  // Removed auto-location on mount - only gets location when recenter is pressed

  // Geofence notifications removed

  const handleZoom = async (factor: number) => {
    if (!mapRef.current) return;
    
    // Get the current visible region from the map
    const camera = await mapRef.current.getCamera();
    const currentRegion = {
      latitude: camera.center.latitude,
      longitude: camera.center.longitude,
      latitudeDelta: clampDelta(region.latitudeDelta * factor),
      longitudeDelta: clampDelta(region.longitudeDelta * factor),
    };
    
    setRegion(currentRegion);
    mapRef.current.animateToRegion(currentRegion, 300);
  };

  const handleRecenter = async () => {
    // Get fresh location and center map
    await getUserLocation(true);
  };

  const toggleMapType = () => {
    setMapType((prev) => {
      if (prev === 'standard') return 'satellite';
      if (prev === 'satellite') return 'terrain';
      return 'standard';
    });
  };

  const selectMapTheme = (theme: 'standard' | 'dark' | 'retro' | 'high-contrast') => {
    setMapStyleTheme(theme);
    setShowThemePicker(false);
  };

  const cycleMapStyleTheme = () => {
    setMapStyleTheme((prev) => {
      if (prev === 'standard') return 'dark';
      if (prev === 'dark') return 'retro';
      if (prev === 'retro') return 'high-contrast';
      return 'standard';
    });
  };

  const themeOptions = [
    { value: 'standard', label: 'Standard', icon: 'map-outline', description: 'Clean minimal style' },
    { value: 'dark', label: 'Dark Mode', icon: 'moon', description: 'Reduce eye strain' },
    { value: 'retro', label: 'Retro', icon: 'time-outline', description: 'Vintage paper map' },
    { value: 'high-contrast', label: 'High Contrast', icon: 'contrast', description: 'Maximum accessibility' },
  ] as const;

  const handlePoiPress = (poi: Poi) => {
    if (!mapRef.current) return;
    
    const newRegion = {
      latitude: poi.coordinate.latitude,
      longitude: poi.coordinate.longitude,
      latitudeDelta: 0.005, // Zoom in closer
      longitudeDelta: 0.005,
    };
    
    setRegion(newRegion);
    mapRef.current.animateToRegion(newRegion, 500);
    
    // Update selected POI and collapse legend
    setSelectedPoi(poi);
    if (isLegendExpanded) {
      setIsLegendExpanded(false);
      Animated.spring(legendAnimation, {
        toValue: 0,
        useNativeDriver: false,
        friction: 8,
        tension: 40,
      }).start();
    }
  };

  const toggleLegend = () => {
    const toValue = isLegendExpanded ? 0 : 1;
    setIsLegendExpanded(!isLegendExpanded);
    
    Animated.spring(legendAnimation, {
      toValue,
      useNativeDriver: false,
      friction: 8,
      tension: 40,
    }).start();
  };

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        mapType={mapType}
        initialRegion={region}
        showsUserLocation
        showsCompass
        showsMyLocationButton={false}
        customMapStyle={mapStyle}
      >
        {POIS.map((poi) => (
          <View key={poi.id}>
            <Marker
              coordinate={poi.coordinate}
              title={poi.title}
              description={poi.description}
            >
              <View
                style={[
                  styles.marker,
                  {
                    backgroundColor: poi.color,
                    shadowColor: poi.color,
                  },
                ]}
              >
                <Ionicons name="paw" size={18} color="#000" />
              </View>
            </Marker>
            <Circle
              center={poi.coordinate}
              radius={poi.radius}
              strokeColor={`${poi.color}99`}
              fillColor={`${poi.color}33`}
            />
          </View>
        ))}      </MapView>

      {/* Drawer Button */}
      <Pressable
        style={[styles.drawerButton, { backgroundColor: buttonColors.background }]}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      >
        <Ionicons name="menu" size={24} color={buttonColors.foreground} />
      </Pressable>

      {/* Map Style Theme Button */}
      <Pressable
        style={[styles.styleButton, { backgroundColor: buttonColors.background }]}
        onPress={cycleMapStyleTheme}
        onLongPress={() => setShowThemePicker(true)}
        delayLongPress={300}
      >
        <Ionicons name="color-palette" size={24} color={buttonColors.foreground} />
      </Pressable>

      {/* Home Button */}
      <Pressable
        style={[styles.homeButton, { backgroundColor: buttonColors.background }]}
        onPress={() => router.push('/(drawer)/home')}
      >
        <Ionicons name="home" size={24} color={buttonColors.foreground} />
      </Pressable>

      <View style={styles.controlColumn}>
        <MapButton
          label="+"
          onPress={() => handleZoom(0.6)}
          bgColor={buttonColors.background}
          fgColor={buttonColors.foreground}
        />
        <MapButton
          icon="locate"
          onPress={handleRecenter}
          bgColor={buttonColors.background}
          fgColor={buttonColors.foreground}
        />
        <MapButton
          icon="layers"
          onPress={toggleMapType}
          bgColor={buttonColors.background}
          fgColor={buttonColors.foreground}
        />
        <MapButton
          icon={isGeofencingActive ? "notifications" : "notifications-outline"}
          onPress={isGeofencingActive ? stopGeofencing : startGeofencing}
          bgColor={isGeofencingActive ? "#4CAF50" : buttonColors.background}
          fgColor={isGeofencingActive ? "#FFF" : buttonColors.foreground}
        />
        <MapButton
          label="-"
          onPress={() => handleZoom(1.6)}
          bgColor={buttonColors.background}
          fgColor={buttonColors.foreground}
        />
      </View>

      <Animated.View
        style={[
          styles.legend,
          {
            backgroundColor: themeColors.card,
            borderColor: themeColors.border,
            maxHeight: legendAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [130, 400],
            }),
            opacity: legendAnimation.interpolate({
              inputRange: [0, 0.3, 1],
              outputRange: [0.95, 0.98, 1],
            }),
          },
        ]}
      >
        {/* Draggable Handle Bar */}
        <Pressable onPress={toggleLegend} style={styles.legendHandle}>
          <View style={[styles.handleBar, { backgroundColor: themeColors.text + '40' }]} />
          <Text style={[styles.legendTitle, { color: themeColors.text }]}>
            Cat-Friendly Places Near You
          </Text>
          <Ionicons 
            name={isLegendExpanded ? "chevron-down" : "chevron-up"} 
            size={20} 
            color={themeColors.text} 
          />
        </Pressable>

        {/* Show selected location when collapsed */}
        {!isLegendExpanded && (
          <Pressable 
            onPress={() => handlePoiPress(selectedPoi)}
            style={({ pressed }) => [
              styles.legendRow,
              pressed && styles.legendRowPressed
            ]}
          >
            <View
              style={[styles.legendDot, { backgroundColor: selectedPoi.color }]}
            />
            <View style={styles.legendTextContainer}>
              <Text style={[styles.legendLabel, { color: themeColors.text }]}>
                {selectedPoi.title}
              </Text>
              <Text style={[styles.legendDesc, { color: mutedTextColor }]} numberOfLines={1}>
                {selectedPoi.description}
              </Text>
            </View>
          </Pressable>
        )}

        <Animated.View
          style={{
            opacity: legendAnimation,
            transform: [
              {
                translateY: legendAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-10, 0],
                }),
              },
            ],
          }}
        >
          {isLegendExpanded && POIS.map((poi) => (
            <Pressable 
              key={poi.id}
              onPress={() => handlePoiPress(poi)}
              style={({ pressed }) => [
                styles.legendRow,
                pressed && styles.legendRowPressed
              ]}
            >
              <View
                style={[styles.legendDot, { backgroundColor: poi.color }]}
              />
              <View style={styles.legendTextContainer}>
                <Text style={[styles.legendLabel, { color: themeColors.text }]}>
                  {poi.title}
                </Text>
                <Text style={[styles.legendDesc, { color: mutedTextColor }]}>
                  {poi.description}
                </Text>
              </View>
            </Pressable>
          ))}
        </Animated.View>
      </Animated.View>

      {/* Theme Picker Modal */}
      <Modal
        visible={showThemePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowThemePicker(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowThemePicker(false)}
        >
          <View 
            style={[styles.themePickerContainer, { backgroundColor: themeColors.card }]}
            onStartShouldSetResponder={() => true}
          >
            <Text style={[styles.themePickerTitle, { color: themeColors.text }]}>
              Choose Map Theme
            </Text>
            {themeOptions.map((theme) => (
              <Pressable
                key={theme.value}
                style={({ pressed }) => [
                  styles.themeOption,
                  mapStyleTheme === theme.value && styles.themeOptionSelected,
                  pressed && styles.themeOptionPressed,
                  { borderColor: themeColors.border }
                ]}
                onPress={() => selectMapTheme(theme.value)}
              >
                <View style={styles.themeOptionLeft}>
                  <Ionicons 
                    name={theme.icon} 
                    size={28} 
                    color={mapStyleTheme === theme.value ? themeColors.primary : themeColors.text} 
                  />
                  <View style={styles.themeOptionText}>
                    <Text style={[
                      styles.themeOptionLabel, 
                      { color: themeColors.text },
                      mapStyleTheme === theme.value && { fontWeight: '700' }
                    ]}>
                      {theme.label}
                    </Text>
                    <Text style={[styles.themeOptionDesc, { color: mutedTextColor }]}>
                      {theme.description}
                    </Text>
                  </View>
                </View>
                {mapStyleTheme === theme.value && (
                  <Ionicons name="checkmark-circle" size={24} color={themeColors.primary} />
                )}
              </Pressable>
            ))}
            <Pressable
              style={[styles.closeButton, { backgroundColor: themeColors.primary }]}
              onPress={() => setShowThemePicker(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

type MapButtonProps = {
  onPress: () => void;
  label?: string;
  icon?: ComponentProps<typeof Ionicons>["name"];
  bgColor: string;
  fgColor: string;
};

function MapButton({ onPress, label, icon, bgColor, fgColor }: MapButtonProps) {
  return (
    <Pressable
      style={[styles.mapButton, { backgroundColor: bgColor }]}
      onPress={onPress}
    >
      {label ? (
        <Text style={[styles.mapButtonLabel, { color: fgColor }]}>{label}</Text>
      ) : (
        icon && <Ionicons name={icon} size={18} color={fgColor} />
      )}
    </Pressable>
  );
}

function computeDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function clampDelta(value: number) {
  return Math.min(Math.max(value, 0.001), 0.1);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerButton: {
    position: "absolute",
    top: Platform.select({ ios: 60, android: 50 }),
    left: isTablet ? 24 : 16,
    width: isTablet ? 60 : 50,
    height: isTablet ? 60 : 50,
    borderRadius: isTablet ? 30 : 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  styleButton: {
    position: "absolute",
    top: Platform.select({ ios: 130, android: 120 }),
    left: isTablet ? 24 : 16,
    width: isTablet ? 60 : 50,
    height: isTablet ? 60 : 50,
    borderRadius: isTablet ? 30 : 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  homeButton: {
    position: "absolute",
    top: Platform.select({ ios: 60, android: 50 }),
    right: isTablet ? 24 : 16,
    width: isTablet ? 60 : 50,
    height: isTablet ? 60 : 50,
    borderRadius: isTablet ? 30 : 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  controlColumn: {
    position: "absolute",
    right: 16,
    top: 130,
    gap: 12,
  },
  mapButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  mapButtonLabel: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  marker: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  legend: {
    position: "absolute",
    left: isTablet ? 24 : 16,
    right: isTablet ? 24 : 16,
    bottom: isTablet ? 40 : 32,
    paddingHorizontal: isTablet ? 20 : 16,
    paddingBottom: isTablet ? 20 : 16,
    borderRadius: 18,
    overflow: "hidden",
    maxWidth: isLargeDevice ? 600 : undefined,
    alignSelf: isLargeDevice ? 'center' : undefined,
  },
  legendHandle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingTop: 16,
    gap: 12,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    position: "absolute",
    top: 8,
    left: "50%",
    marginLeft: -20,
  },
  legendTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: "600",
    flex: 1,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: isTablet ? 16 : 12,
    padding: isTablet ? 12 : 8,
    borderRadius: 8,
  },
  legendRowPressed: {
    opacity: 0.6,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  legendTextContainer: {
    flex: 1,
  },
  legendDot: {
    width: isTablet ? 16 : 14,
    height: isTablet ? 16 : 14,
    borderRadius: isTablet ? 8 : 7,
  },
  legendLabel: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: "600",
  },
  legendDesc: {
    fontSize: isTablet ? 14 : 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  themePickerContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  themePickerTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  themeOptionSelected: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  themeOptionPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  themeOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  themeOptionText: {
    flex: 1,
  },
  themeOptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  themeOptionDesc: {
    fontSize: 13,
  },
  closeButton: {
    marginTop: 8,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

const darkMapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#1f1f1f" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#f5f5f5" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#1f1f1f" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#2c2c2c" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#383838" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0b355d" }],
  },
];

const retroMapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#ebe3cd" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#523735" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#f5f1e6" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#c9b2a6" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#dfd2ae" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#dfd2ae" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [{ color: "#a5b076" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#f5f1e6" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.fill",
    stylers: [{ color: "#fdfcf8" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#b9d3c2" }],
  },
];

const highContrastMapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#000000" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#ffffff" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#000000" }, { weight: 3 }],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#ffff00" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#1a1a1a" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#00ff00" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#ffff00" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0000ff" }],
  },
];


