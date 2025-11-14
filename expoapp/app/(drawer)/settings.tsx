// app/(drawer)/settings.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import BottomNav from "../../components/BottomNav";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  FadeIn,
  FadeInDown,
  SharedValue,
  interpolateColor,
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useProfile } from "../../contexts/ProfileContext";
import { 
  setThemeMode, 
  setAccentColor,
  setCustomColors,
  saveThemeToStorage,
  selectTheme,
  selectThemeColors,
  selectThemeMode,
  selectAccentColor,
} from "../../store/themeSlice";

const GENRES = ["Pop", "Rock", "Jazz", "Classical", "Hip-Hop"];
const FORM_CACHE_KEY = "@profile_form_cache";

const PRESET_COLORS = [
  { name: "Spotify Green", color: "#1DB954" },
  { name: "Ocean Blue", color: "#1E90FF" },
  { name: "Sunset Orange", color: "#FF6B35" },
  { name: "Purple Heart", color: "#9B59B6" },
  { name: "Ruby Red", color: "#E74C3C" },
  { name: "Mint Green", color: "#2ECC71" },
  { name: "Golden Yellow", color: "#F39C12" },
  { name: "Hot Pink", color: "#FF1493" },
  { name: "Teal", color: "#00CED1" },
  { name: "Coral", color: "#FF7F50" },
  { name: "Lavender", color: "#B57EDC" },
  { name: "Lime", color: "#32CD32" },
];

const THEME_PRESETS = [
  { 
    name: "Midnight Blue", 
    colors: { background: "#0A1929", card: "#1A2332", text: "#FFFFFF", border: "#2A3F5F", primary: "#1DB954", notification: "#FF6B6B" }
  },
  { 
    name: "Deep Purple", 
    colors: { background: "#1A0033", card: "#2D1B4E", text: "#FFFFFF", border: "#4A3366", primary: "#1DB954", notification: "#FF6B6B" }
  },
  { 
    name: "Forest Green", 
    colors: { background: "#0D1F17", card: "#1A2F27", text: "#FFFFFF", border: "#2A4F3F", primary: "#1DB954", notification: "#FF6B6B" }
  },
  { 
    name: "Charcoal", 
    colors: { background: "#1C1C1C", card: "#2A2A2A", text: "#FFFFFF", border: "#3A3A3A", primary: "#1DB954", notification: "#FF6B6B" }
  },
  { 
    name: "Navy", 
    colors: { background: "#001F3F", card: "#003D5C", text: "#FFFFFF", border: "#005B7F", primary: "#1DB954", notification: "#FF6B6B" }
  },
  { 
    name: "Burgundy", 
    colors: { background: "#2D0A1F", card: "#4A1A36", text: "#FFFFFF", border: "#6A2A4F", primary: "#1DB954", notification: "#FF6B6B" }
  },
];

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const router = useRouter();

  // Redux theme state
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const themeColors = useAppSelector(selectThemeColors);
  const themeMode = useAppSelector(selectThemeMode);
  const accentColor = useAppSelector(selectAccentColor);

  // Profile context
  const { username: displayUsername, profileImage } = useProfile();

  // Animation value for theme transitions
  const themeProgress = useSharedValue(themeMode === 'dark' ? 1 : 0);

  // Profile form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [genre, setGenre] = useState("");

  // Validation errors
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [genreError, setGenreError] = useState("");

  // Animation values
  const usernameShake = useSharedValue(0);
  const emailShake = useSharedValue(0);
  const genreShake = useSharedValue(0);

  // Animated styles
  const usernameAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: usernameShake.value }],
  }));

  const emailAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: emailShake.value }],
  }));

  const genreAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: genreShake.value }],
  }));

  const triggerShake = (shakeValue: SharedValue<number>) => {
    shakeValue.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  // Load cached form data on mount
  useEffect(() => {
    loadCachedFormData();
  }, []);

  // Cache form data whenever it changes
  useEffect(() => {
    cacheFormData();
  }, [username, email, genre]);

  const loadCachedFormData = async () => {
    try {
      const cachedData = await AsyncStorage.getItem(FORM_CACHE_KEY);
      if (cachedData) {
        const { username: cachedUsername, email: cachedEmail, genre: cachedGenre } = JSON.parse(cachedData);
        setUsername(cachedUsername || "");
        setEmail(cachedEmail || "");
        setGenre(cachedGenre || "");
      }
    } catch (error) {
      console.error("Failed to load cached form data:", error);
    }
  };

  const cacheFormData = async () => {
    try {
      const formData = {
        username,
        email,
        genre,
      };
      await AsyncStorage.setItem(FORM_CACHE_KEY, JSON.stringify(formData));
    } catch (error) {
      console.error("Failed to cache form data:", error);
    }
  };

  const clearCache = async () => {
    try {
      await AsyncStorage.removeItem(FORM_CACHE_KEY);
    } catch (error) {
      console.error("Failed to clear cache:", error);
    }
  };

  // Validation functions
  const validateUsername = (value: string) => {
    if (value.length === 0) {
      setUsernameError("");
      return false;
    }
    if (value.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      triggerShake(usernameShake);
      return false;
    }
    if (value.length > 20) {
      setUsernameError("Username must be 20 characters or less");
      triggerShake(usernameShake);
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      setUsernameError("Username can only contain letters, numbers, and underscores");
      triggerShake(usernameShake);
      return false;
    }
    setUsernameError("");
    return true;
  };

  const validateEmail = (value: string) => {
    if (value.length === 0) {
      setEmailError("");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address");
      triggerShake(emailShake);
      return false;
    }
    setEmailError("");
    return true;
  };

  const validateGenre = (value: string) => {
    if (value.length === 0) {
      setGenreError("Please select a genre");
      triggerShake(genreShake);
      return false;
    }
    if (!GENRES.includes(value)) {
      setGenreError("Please select a valid genre from the list");
      triggerShake(genreShake);
      return false;
    }
    setGenreError("");
    return true;
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    validateUsername(value);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    validateEmail(value);
  };

  const handleGenreSelect = (selectedGenre: string) => {
    setGenre(selectedGenre);
    validateGenre(selectedGenre);
  };

  const handleCreateProfile = () => {
    // Validate all fields
    const isUsernameValid = validateUsername(username);
    const isEmailValid = validateEmail(email);
    const isGenreValid = validateGenre(genre);

    if (isUsernameValid && isEmailValid && isGenreValid) {
      Alert.alert(
        "Profile Created!",
        `Username: ${username}\nEmail: ${email}\nFavorite Genre: ${genre}`,
        [
          {
            text: "OK",
            onPress: async () => {
              // Clear cache
              await clearCache();
              
              // Reset form
              setUsername("");
              setEmail("");
              setGenre("");
              
              // Clear validation errors
              setUsernameError("");
              setEmailError("");
              setGenreError("");
              
              setShowProfileForm(false);
            },
          },
        ]
      );
    } else {
      Alert.alert("Validation Error", "Please fix all errors before submitting");
    }
  };

  const handleThemeChange = (mode: 'light' | 'dark' | 'custom') => {
    dispatch(setThemeMode(mode));
    
    // Animate theme transition (only for light/dark, custom keeps current appearance)
    if (mode === 'light') {
      themeProgress.value = withTiming(0, { duration: 300 });
    } else if (mode === 'dark') {
      themeProgress.value = withTiming(1, { duration: 300 });
    }
    // For custom mode, keep current animation state (don't animate)
    
    // Open theme picker when custom mode is selected
    if (mode === 'custom') {
      setShowThemePicker(true);
    }
  };

  const handleCustomThemeSelect = (colors: any) => {
    dispatch(setCustomColors(colors));
  };

  const handleAccentColorChange = (color: string) => {
    dispatch(setAccentColor(color));
  };

  // Save theme whenever it changes
  useEffect(() => {
    dispatch(saveThemeToStorage(theme) as any);
  }, [theme, dispatch]);

  // Animated background style
  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      themeProgress.value,
      [0, 1],
      ['#FFFFFF', '#121212']
    );
    return { backgroundColor };
  });

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <ScrollView style={{ flex: 1, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
        <Text style={[styles.header, { color: themeColors.text }]}>⚙️ Settings ⚙️</Text>

      {/* Profile Image */}
      <View style={styles.profileContainer}>
        <Image
          source={profileImage ? { uri: profileImage } : require("../../assets/images/catpfp.png")}
          style={styles.profileImage}
        />
        <Text style={[styles.profileName, { color: themeColors.text }]}>{displayUsername}</Text>
      </View>

      {/* Create Profile Button */}
      <TouchableOpacity
        style={[styles.createProfileButton, { backgroundColor: accentColor }]}
        onPress={() => setShowProfileForm(!showProfileForm)}
      >
        <Ionicons name="person-add" size={20} color="#FFFFFF" />
        <Text style={styles.createProfileText}>
          {showProfileForm ? "Hide Profile Form" : "Create Profile"}
        </Text>
      </TouchableOpacity>

      {/* Profile Form */}
      {showProfileForm && (
        <Animated.View 
          entering={FadeInDown.duration(400).springify()}
          style={styles.profileForm}
        >
          <Text style={styles.formTitle}>Profile Information</Text>

          {/* Username Field */}
          <Animated.View style={[styles.inputContainer, usernameAnimatedStyle]}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={[styles.input, usernameError ? styles.inputError : null]}
              placeholder="Enter username..."
              placeholderTextColor="#666"
              value={username}
              onChangeText={handleUsernameChange}
              autoCapitalize="none"
            />
            {usernameError ? (
              <Animated.View 
                entering={FadeIn.duration(200)}
                style={styles.errorContainer}
              >
                <Ionicons name="alert-circle" size={16} color="#FF6B6B" />
                <Text style={styles.errorText}>{usernameError}</Text>
              </Animated.View>
            ) : username.length > 0 ? (
              <Animated.View 
                entering={FadeIn.duration(200)}
                style={styles.successContainer}
              >
                <Ionicons name="checkmark-circle" size={16} color="#1DB954" />
                <Text style={styles.successText}>Valid username</Text>
              </Animated.View>
            ) : null}
          </Animated.View>

          {/* Email Field */}
          <Animated.View style={[styles.inputContainer, emailAnimatedStyle]}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={[styles.input, emailError ? styles.inputError : null]}
              placeholder="Enter email..."
              placeholderTextColor="#666"
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {emailError ? (
              <Animated.View 
                entering={FadeIn.duration(200)}
                style={styles.errorContainer}
              >
                <Ionicons name="alert-circle" size={16} color="#FF6B6B" />
                <Text style={styles.errorText}>{emailError}</Text>
              </Animated.View>
            ) : email.length > 0 ? (
              <Animated.View 
                entering={FadeIn.duration(200)}
                style={styles.successContainer}
              >
                <Ionicons name="checkmark-circle" size={16} color="#1DB954" />
                <Text style={styles.successText}>Valid email</Text>
              </Animated.View>
            ) : null}
          </Animated.View>

          {/* Genre Selection */}
          <Animated.View style={[styles.inputContainer, genreAnimatedStyle]}>
            <Text style={styles.inputLabel}>Favorite Genre</Text>
            <View style={styles.genreContainer}>
              {GENRES.map((genreOption) => (
                <TouchableOpacity
                  key={genreOption}
                  style={[
                    styles.genreChip,
                    genre === genreOption && styles.genreChipSelected,
                  ]}
                  onPress={() => handleGenreSelect(genreOption)}
                >
                  <Text
                    style={[
                      styles.genreChipText,
                      genre === genreOption && styles.genreChipTextSelected,
                    ]}
                  >
                    {genreOption}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {genreError ? (
              <Animated.View 
                entering={FadeIn.duration(200)}
                style={styles.errorContainer}
              >
                <Ionicons name="alert-circle" size={16} color="#FF6B6B" />
                <Text style={styles.errorText}>{genreError}</Text>
              </Animated.View>
            ) : genre.length > 0 ? (
              <Animated.View 
                entering={FadeIn.duration(200)}
                style={styles.successContainer}
              >
                <Ionicons name="checkmark-circle" size={16} color="#1DB954" />
                <Text style={styles.successText}>Genre selected</Text>
              </Animated.View>
            ) : null}
          </Animated.View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!username || !email || !genre || !!usernameError || !!emailError || !!genreError) &&
                styles.submitButtonDisabled,
            ]}
            onPress={handleCreateProfile}
            disabled={!username || !email || !genre || !!usernameError || !!emailError || !!genreError}
          >
            <Text style={styles.submitButtonText}>Create Profile</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Divider */}
      <View style={styles.divider} />

      {/* Notifications Toggle */}
      <View style={styles.settingItem}>
        <Text style={[styles.settingText, { color: themeColors.text }]}>Notifications</Text>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          thumbColor={notifications ? accentColor : "#888"}
          trackColor={{ true: accentColor, false: "#555" }}
        />
      </View>

      {/* Theme Mode Selector */}
      <View style={[styles.themeSection, { borderColor: themeColors.border }]}>
        <Text style={[styles.settingText, { color: themeColors.text, marginBottom: 12 }]}>Theme</Text>
        <View style={styles.themeModeContainer}>
          <TouchableOpacity
            style={[
              styles.themeModeButton,
              { borderColor: themeColors.border },
              themeMode === 'light' && { backgroundColor: accentColor },
            ]}
            onPress={() => handleThemeChange('light')}
          >
            <Ionicons 
              name="sunny" 
              size={20} 
              color={themeMode === 'light' ? '#FFFFFF' : themeColors.text} 
            />
            <Text style={[
              styles.themeModeText,
              { color: themeMode === 'light' ? '#FFFFFF' : themeColors.text }
            ]}>
              Light
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.themeModeButton,
              { borderColor: themeColors.border },
              themeMode === 'dark' && { backgroundColor: accentColor },
            ]}
            onPress={() => handleThemeChange('dark')}
          >
            <Ionicons 
              name="moon" 
              size={20} 
              color={themeMode === 'dark' ? '#FFFFFF' : themeColors.text} 
            />
            <Text style={[
              styles.themeModeText,
              { color: themeMode === 'dark' ? '#FFFFFF' : themeColors.text }
            ]}>
              Dark
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.themeModeButton,
              { borderColor: themeColors.border },
              themeMode === 'custom' && { backgroundColor: accentColor },
            ]}
            onPress={() => handleThemeChange('custom')}
          >
            <Ionicons 
              name="color-palette" 
              size={20} 
              color={themeMode === 'custom' ? '#FFFFFF' : themeColors.text} 
            />
            <Text style={[
              styles.themeModeText,
              { color: themeMode === 'custom' ? '#FFFFFF' : themeColors.text }
            ]}>
              Custom
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Accent Color Picker */}
      <TouchableOpacity
        style={[styles.colorPickerButton, { borderColor: themeColors.border }]}
        onPress={() => setShowColorPicker(true)}
      >
        <View style={styles.colorPickerContent}>
          <Text style={[styles.settingText, { color: themeColors.text }]}>Accent Color</Text>
          <View style={styles.colorPreviewContainer}>
            <View style={[styles.colorPreview, { backgroundColor: accentColor }]} />
            <Ionicons name="chevron-forward" size={20} color={themeColors.text} />
          </View>
        </View>
      </TouchableOpacity>

      {/* Color Picker Modal */}
      <Modal
        visible={showColorPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowColorPicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.colorPickerModal, { backgroundColor: themeColors.card }]}>
            <Text style={[styles.modalTitle, { color: themeColors.text }]}>Choose Accent Color</Text>
            
            <ScrollView style={styles.colorGrid} showsVerticalScrollIndicator={false}>
              <View style={styles.colorRow}>
                {PRESET_COLORS.map((preset) => (
                  <TouchableOpacity
                    key={preset.color}
                    style={[
                      styles.colorSwatch,
                      { backgroundColor: preset.color },
                      accentColor === preset.color && styles.selectedSwatch,
                    ]}
                    onPress={() => {
                      handleAccentColorChange(preset.color);
                      setShowColorPicker(false);
                    }}
                  >
                    {accentColor === preset.color && (
                      <Ionicons name="checkmark" size={24} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            
            <TouchableOpacity
              style={[styles.modalCloseButton, { backgroundColor: accentColor }]}
              onPress={() => setShowColorPicker(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Theme Picker Modal */}
      <Modal
        visible={showThemePicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowThemePicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.colorPickerModal, { backgroundColor: themeColors.card }]}>
            <Text style={[styles.modalTitle, { color: themeColors.text }]}>Choose Custom Theme</Text>
            
            <ScrollView style={styles.colorGrid} showsVerticalScrollIndicator={false}>
              {THEME_PRESETS.map((preset) => (
                <TouchableOpacity
                  key={preset.name}
                  style={[
                    styles.themePresetCard,
                    { backgroundColor: preset.colors.background, borderColor: preset.colors.border },
                  ]}
                  onPress={() => {
                    handleCustomThemeSelect(preset.colors);
                    setShowThemePicker(false);
                  }}
                >
                  <View style={styles.themePresetHeader}>
                    <Text style={[styles.themePresetName, { color: preset.colors.text }]}>{preset.name}</Text>
                    {themeColors.background === preset.colors.background && (
                      <Ionicons name="checkmark-circle" size={24} color={preset.colors.primary} />
                    )}
                  </View>
                  <View style={styles.themePresetColors}>
                    <View style={[styles.themeColorDot, { backgroundColor: preset.colors.background }]} />
                    <View style={[styles.themeColorDot, { backgroundColor: preset.colors.card }]} />
                    <View style={[styles.themeColorDot, { backgroundColor: preset.colors.primary }]} />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TouchableOpacity
              style={[styles.modalCloseButton, { backgroundColor: accentColor }]}
              onPress={() => setShowThemePicker(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Logout Button */}
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: accentColor }]}
        onPress={() => router.replace("/login")}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
      </ScrollView>
      <BottomNav />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Spotify dark background
    padding: 20,
  },
  header: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50, // circular
    marginBottom: 10,
  },
  profileName: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  settingText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#2A2A2A",
    marginVertical: 20,
  },
  logoutButton: {
    backgroundColor: "#1DB954", // Spotify green
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  logoutText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  createProfileButton: {
    backgroundColor: "#1DB954",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    gap: 8,
  },
  createProfileText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  profileForm: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  formTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 12,
    color: "#FFFFFF",
    fontSize: 16,
    borderWidth: 2,
    borderColor: "#2A2A2A",
  },
  inputError: {
    borderColor: "#FF6B6B",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 6,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
  },
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 6,
  },
  successText: {
    color: "#1DB954",
    fontSize: 12,
  },
  genreContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  },
  genreChip: {
    backgroundColor: "#2A2A2A",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#2A2A2A",
  },
  genreChipSelected: {
    backgroundColor: "#1DB954",
    borderColor: "#1DB954",
  },
  genreChipText: {
    color: "#B3B3B3",
    fontSize: 14,
    fontWeight: "600",
  },
  genreChipTextSelected: {
    color: "#FFFFFF",
  },
  submitButton: {
    backgroundColor: "#1DB954",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: "#555",
    opacity: 0.5,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  themeSection: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    marginBottom: 15,
  },
  themeModeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  themeModeButton: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
    gap: 6,
  },
  themeModeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  colorPickerButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    marginBottom: 15,
  },
  colorPickerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  colorPreviewContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  colorPreview: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#2A2A2A",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 20,
  },
  colorPickerModal: {
    width: "100%",
    height: 500,
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalCloseButton: {
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  modalCloseText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  colorGrid: {
    flex: 1,
    marginVertical: 10,
  },
  colorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 15,
    paddingVertical: 10,
  },
  colorSwatch: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "transparent",
  },
  selectedSwatch: {
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  themePresetCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 2,
  },
  themePresetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  themePresetName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  themePresetColors: {
    flexDirection: "row",
    gap: 10,
  },
  themeColorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
});
