// app/home.tsx
import { Text, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import MasonryList from "react-native-masonry-list";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const router = useRouter();

  const images = [
    { source: require("../../assets/images/catsmile.gif"), dimensions: { width: 400, height: 300 } },
    { source: require("../../assets/images/catarmycat.gif"), dimensions: { width: 500, height: 400 } },
    { source: require("../../assets/images/coolfun.gif"), dimensions: { width: 400, height: 500 } },
    { source: require("../../assets/images/cat-army-cat.gif"), dimensions: { width: 450, height: 350 } },
    { source: require("../../assets/images/cathappy.gif"), dimensions: { width: 400, height: 400 } },
    { source: require("../../assets/images/bowlcat.gif"), dimensions: { width: 420, height: 360 } },
    { source: require("../../assets/images/catkiss.gif"), dimensions: { width: 380, height: 400 } },
    { source: require("../../assets/images/prayge.gif"), dimensions: { width: 500, height: 500 } },
    { source: require("../../assets/images/boxcat.gif"), dimensions: { width: 400, height: 420 } },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>🐾 Catboard 🐾</Text>
      </View>

      {/* Masonry grid fills all available space */}
      <View style={styles.gridWrapper}>
        <MasonryList
          images={images}
          columns={2}
          spacing={6}
          imageContainerStyle={{
            borderRadius: 12,
            backgroundColor: "#121212",
          }}
          listContainerStyle={{
            paddingHorizontal: 8,
            backgroundColor: "#121212",
          }}
        />
      </View>

      {/* Fixed bottom nav */}
      <View style={styles.bottomNav}>
        {/* Home */}
        <TouchableOpacity onPress={() => router.push("/home")} style={styles.navItem}>
          <Ionicons name="home" size={26} color="white" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity onPress={() => router.push("/profile")} style={styles.navItem}>
          <Image
            source={require("../../assets/images/catpfp.png")}
            style={styles.profileImage}
          />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>

        {/* Leave */}
        <TouchableOpacity onPress={() => router.replace("/login")} style={styles.navItem}>
          <Ionicons name="exit-outline" size={26} color="red" />
          <Text style={[styles.navText, { color: "red" }]}>Leave</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  headerContainer: {
    paddingVertical: 6,
    alignItems: "center",
    backgroundColor: "#121212",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  gridWrapper: {
    flex: 1, // ✅ ensures grid uses all remaining space
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60, // ✅ fixed height (smaller)
    borderTopWidth: 1,
    borderTopColor: "#333",
    backgroundColor: "#181818",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 11,
    marginTop: 2,
    color: "white",
  },
  profileImage: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
});
