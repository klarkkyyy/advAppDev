import { 
  View, Text, TextInput, StyleSheet, Image, 
  useWindowDimensions, Pressable, Animated 
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useRef } from "react";
import { FontAwesome } from "@expo/vector-icons";

export default function Login() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Track current tab
  const [currentTab, setCurrentTab] = useState<"signin" | "signup">("signin");

  // Animated value for underline
  const underlineX = useRef(new Animated.Value(0)).current;

  const handleTabChange = (tab: "signin" | "signup") => {
    setCurrentTab(tab);
    Animated.spring(underlineX, {
      toValue: tab === "signin" ? 0 : 1,
      useNativeDriver: true,
    }).start();

    router.replace(tab === "signin" ? "/login" : "/signup");
  };

  const handleLogin = () => {
    router.replace("/home");
  };

  // Tab width (half screen since 2 tabs)
  const tabWidth = width * 0.4;

  return (
    <View style={styles.container}>
      {/* Logo + Title */}
      <View style={styles.row}>
        <Image
          source={require("C:/Users/karlm/Documents/USC/3rdYr/AdvAppDev/advAppDev/expoapp/assets/images/spotifyLogo.png")}
          style={[styles.logo, { width: width * 0.2, height: width * 0.2 }]}
          resizeMode="contain"
        />
        <Text style={[styles.title, { fontSize: width * 0.12 }]}>Spotify</Text>
      </View>

      {/* Tabs with underline */}
      <View style={styles.tabRow}>
        <Pressable onPress={() => handleTabChange("signin")} style={{ width: tabWidth }}>
          <Text style={styles.nav}>SIGN IN</Text>
        </Pressable>
        <Pressable onPress={() => handleTabChange("signup")} style={{ width: tabWidth }}>
          <Text style={styles.nav}>SIGN UP</Text>
        </Pressable>

        {/* Animated underline */}
        <Animated.View
          style={[
            styles.underline,
            {
              width: tabWidth,
              transform: [
                {
                  translateX: underlineX.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, tabWidth],
                  }),
                },
              ],
            },
          ]}
        />
      </View>

      {/* Form */}
      <View style={styles.form}>
        <TextInput
          style={[styles.input, { width: width * 0.8 }]}
          placeholder="Username"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={[styles.input, { width: width * 0.8 }]}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Sign In button */}
        <Pressable
          style={({ pressed }) => [
            styles.signInButton,
            pressed && { opacity: 0.8 },
          ]}
          onPress={handleLogin}
        >
          <Text style={styles.signInButtonText}>Sign In</Text>
        </Pressable>

        {/* Separator */}
        <View style={styles.separatorRow}>
          <View style={styles.line} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.line} />
        </View>

        {/* Social login buttons */}
        {/* Social login circle buttons */}
<View style={styles.socialButtonsRow}>
  {/* Facebook */}
  <Pressable
    style={({ pressed }) => [
      styles.socialCircle,
      { backgroundColor: "#1877F2" },
      pressed && { opacity: 0.8 },
    ]}
    onPress={() => console.log("Login with Facebook")}
  >
    <FontAwesome name="facebook" size={24} color="#fff" />
  </Pressable>

  {/* Google */}
  <Pressable
    style={({ pressed }) => [
      styles.socialCircle,
      { backgroundColor: "#fff", borderWidth: 1, borderColor: "#ddd" },
      pressed && { opacity: 0.8 },
    ]}
    onPress={() => console.log("Login with Google")}
  >
    <FontAwesome name="google" size={24} color="#DB4437" />
  </Pressable>
</View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "center",
    position: "relative",
    marginBottom: 30,
  },
  logo: {
    marginRight: 15,
  },
  socialButtonsRow: {
  flexDirection: "row",
  justifyContent: "center",
  width: "80%",
  marginTop: 15,
},

socialCircle: {
  width: 50,
  height: 50,
  borderRadius: 25,
  justifyContent: "center",
  alignItems: "center",
  marginHorizontal: 10,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
  elevation: 3,
},
  title: {
    color: "#fff",
    fontWeight: "bold",
  },
  nav: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    paddingBottom: 10,
  },
  underline: {
    height: 3,
    backgroundColor: "#1DB954",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  form: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    height: 45,
    borderColor: "#1f1f1fff",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#1b1b1bff",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    color: "#fff",
  },
  signInButton: {
    width: "80%",
    height: 45,
    backgroundColor: "#1DB954",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#1DB954",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  signInButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  separatorRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    marginVertical: 18,
    marginTop: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#888",
  },
  orText: {
    marginHorizontal: 10,
    color: "#888",
    fontSize: 14,
    fontWeight: "500",
  },
  socialButton: {
    width: "10%",
    height: 45,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
