// app/(drawer)/_layout.tsx
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context"; 
import { GestureHandlerRootView } from "react-native-gesture-handler"; // ✅ gesture handler

function CustomDrawerContent(props: any) {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: "#121212" }}
      >
        {/* Profile Section */}
        <TouchableOpacity
          style={styles.profileContainer}
          onPress={() => router.push("/profile")}
          activeOpacity={0.7}
        >
          <Image
            source={require("../../assets/images/catpfp.png")}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.profileName}>Karl Medina</Text>
            <Text style={styles.viewProfile}>View Profile</Text>
          </View>
        </TouchableOpacity>

        {/* Default Drawer Items */}
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    </SafeAreaView>
  );
}

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        defaultStatus="closed" // drawer starts closed
        swipeEnabled={true}    // enables swipe gestures
        edgeWidth={50}         // how far from the edge swipe is detected
        drawerStyle={{ backgroundColor: "#121212", width: 260 }}
        screenOptions={{
          headerStyle: { backgroundColor: "#121212" },
          headerTintColor: "#fff",
          headerShadowVisible: false,
          headerTitle: "",
          drawerActiveTintColor: "#1DB954",
          drawerInactiveTintColor: "#b3b3b3",
          drawerLabelStyle: { fontSize: 15, marginLeft: -10 },
        }}
      >
        <Drawer.Screen
          name="profile"
          options={{
            drawerLabel: " Profile",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="home"
          options={{
            drawerLabel: " Home",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="playlists"
          options={{
            drawerLabel: " Playlists",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="musical-notes-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: "Settings",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#121212",
    borderBottomWidth: 1,
    borderBottomColor: "#282828",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  profileName: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  viewProfile: {
    color: "#1DB954",
    fontSize: 13,
    marginTop: 2,
  },
});
