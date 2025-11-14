import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../store/hooks';
import { selectThemeColors, selectAccentColor } from '../store/themeSlice';
import { useProfile } from '../contexts/ProfileContext';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const themeColors = useAppSelector(selectThemeColors);
  const accentColor = useAppSelector(selectAccentColor);
  const { profileImage } = useProfile();

  return (
    <View style={[styles.bottomNav, { backgroundColor: themeColors.card, borderTopColor: themeColors.border }]}>
      {/* Home */}
      <TouchableOpacity onPress={() => router.push("/home")} style={styles.navItem}>
        <Ionicons 
          name="home" 
          size={26} 
          color={pathname === "/home" ? accentColor : themeColors.text} 
        />
        <Text style={[styles.navText, { color: themeColors.text }, pathname === "/home" && { color: accentColor }]}>
          Home
        </Text>
      </TouchableOpacity>

      {/* Profile */}
      <TouchableOpacity onPress={() => router.push("/profile")} style={styles.navItem}>
        <Image
          source={profileImage ? { uri: profileImage } : require("../assets/images/catpfp.png")}
          style={[styles.profileImage, pathname === "/profile" && { borderWidth: 2, borderColor: accentColor }]}
        />
        <Text style={[styles.navText, { color: themeColors.text }, pathname === "/profile" && { color: accentColor }]}>
          Profile
        </Text>
      </TouchableOpacity>

      {/* Library */}
      <TouchableOpacity onPress={() => router.push("/playlists")} style={styles.navItem}>
        <Ionicons 
          name="library" 
          size={26} 
          color={pathname === "/playlists" ? accentColor : themeColors.text} 
        />
        <Text style={[styles.navText, { color: themeColors.text }, pathname === "/playlists" && { color: accentColor }]}>
          Library
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
    borderTopWidth: 1,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 11,
    marginTop: 2,
  },
  profileImage: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
});