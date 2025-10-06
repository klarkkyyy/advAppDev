// app/(drawer)/settings.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import BottomNav from "../../components/BottomNav";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, paddingBottom: 80 }}>
        <Text style={styles.header}>⚙️ Settings ⚙️</Text>

      {/* Profile Image */}
      <View style={styles.profileContainer}>
        <Image
          source={require("../../assets/images/catpfp.png")}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Karl Medina</Text>
      </View>

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
      </View>
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
});
