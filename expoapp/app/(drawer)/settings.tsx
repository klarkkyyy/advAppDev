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
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GENRES = ["Pop", "Rock", "Jazz", "Classical", "Hip-Hop"];
const FORM_CACHE_KEY = "@profile_form_cache";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const router = useRouter();

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

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>⚙️ Settings ⚙️</Text>

      {/* Profile Image */}
      <View style={styles.profileContainer}>
        <Image
          source={require("../../assets/images/catpfp.png")}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Karl Medina</Text>
      </View>

      {/* Create Profile Button */}
      <TouchableOpacity
        style={styles.createProfileButton}
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
        <Text style={styles.settingText}>Notifications</Text>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          thumbColor={notifications ? "#1DB954" : "#888"}
          trackColor={{ true: "#1DB954", false: "#555" }}
        />
      </View>

      {/* Dark Mode Toggle */}
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Dark Mode</Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          thumbColor={darkMode ? "#1DB954" : "#888"}
          trackColor={{ true: "#1DB954", false: "#555" }}
        />
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => router.replace("/login")}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
      </ScrollView>
      <BottomNav />
    </View>
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
});
