import { 
  View, Text, TextInput, Button, StyleSheet, Image, 
  useWindowDimensions, Pressable, Animated, Platform 
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useRef } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Signup() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState(new Date());

  const [currentTab, setCurrentTab] = useState<"signin" | "signup">("signup");
  const underlineX = useRef(new Animated.Value(1)).current;

  const handleTabChange = (tab: "signin" | "signup") => {
    setCurrentTab(tab);
    Animated.spring(underlineX, {
      toValue: tab === "signin" ? 0 : 1,
      useNativeDriver: true,
    }).start();

    router.replace(tab === "signin" ? "/login" : "/signup");
  };

  const handleSignup = () => {
    router.replace("/home");
  };


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
          placeholder="Email Addres"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={[styles.input, { width: width * 0.8 }]}
          placeholder="Full Name"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={[styles.input, { width: width * 0.8 }]}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Pressable
                style={({ pressed }) => [
                    styles.signUpButton,
                    pressed && { opacity: 0.8 }, // slight fade on press
                ]}
                onPress={handleSignup}
                >
                <Text style={styles.signUpButtonText}>Sign In</Text>
                </Pressable>
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
  signUpButton: {
  width: "70%",
  height: 45,
  backgroundColor: "#1DB954", // Spotify green
  borderRadius: 25,
  justifyContent: "center",
  alignItems: "center",
  marginTop: 10,
  shadowColor: "#1DB954",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 5,
  elevation: 5, // Android shadow
},
signUpButtonText: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 16,
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
  },
});
