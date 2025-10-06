import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.bottomNav}>
      {/* Home */}
      <TouchableOpacity onPress={() => router.push("/home")} style={styles.navItem}>
        <Ionicons 
          name="home" 
          size={26} 
          color={pathname === "/home" ? "#1DB954" : "white"} 
        />
        <Text style={[styles.navText, pathname === "/home" && styles.activeNavText]}>
          Home
        </Text>
      </TouchableOpacity>

      {/* Profile */}
      <TouchableOpacity onPress={() => router.push("/profile")} style={styles.navItem}>
        <Image
          source={require("../assets/images/catpfp.png")}
          style={[styles.profileImage, pathname === "/profile" && styles.activeProfileImage]}
        />
        <Text style={[styles.navText, pathname === "/profile" && styles.activeNavText]}>
          Profile
        </Text>
      </TouchableOpacity>

      {/* Library */}
      <TouchableOpacity onPress={() => router.push("/playlists")} style={styles.navItem}>
        <Ionicons 
          name="library" 
          size={26} 
          color={pathname === "/playlists" ? "#1DB954" : "white"} 
        />
        <Text style={[styles.navText, pathname === "/playlists" && styles.activeNavText]}>
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
    borderTopColor: "#333",
    backgroundColor: "#181818",
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
    color: "white",
  },
  activeNavText: {
    color: "#1DB954",
  },
  profileImage: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  activeProfileImage: {
    borderWidth: 2,
    borderColor: "#1DB954",
  },
});