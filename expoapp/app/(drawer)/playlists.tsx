// app/(drawer)/playlists.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";

const playlists = [
  { id: "1", name: "Chill Vibes", image: require("../../assets/images/chill.jpg") },
  { id: "2", name: "Workout", image: require("../../assets/images/workout.jpg") },
  { id: "3", name: "Top Hits", image: require("../../assets/images/topHits.jpg") },
  { id: "4", name: "Indie", image: require("../../assets/images/indie.jpg") },
  { id: "5", name: "Jazz", image: require("../../assets/images/jazz.jpg") },
  { id: "6", name: "Classical Essentials", image: require("../../assets/images/classical.jpg") },
  { id: "7", name: "Hip Hop Beats", image: require("../../assets/images/hiphop.jpg") },
  { id: "8", name: "Party Mix", image: require("../../assets/images/party.jpg") },
  { id: "9", name: "Acoustic Mornings", image: require("../../assets/images/acoustic.jpg") },
  { id: "10", name: "Lo-fi Study", image: require("../../assets/images/lofi.jpg") },
  { id: "11", name: "Pop Classics", image: require("../../assets/images/pop.jpg") },
  { id: "12", name: "Rock Legends", image: require("../../assets/images/rock.jpg") },
];

export default function PlaylistsScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>🎵 All Playlists 🎵</Text>

      {/* Playlists Grid */}
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <View style={styles.playlistCard}>
            <Image
              source={
                typeof item.image === "string" ? { uri: item.image } : item.image
              }
              style={styles.playlistImage}
            />
            <Text style={styles.playlistName}>{item.name}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Spotify dark theme
    padding: 20,
  },
  header: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  playlistCard: {
    width: "48%",
    marginBottom: 15,
  },
  playlistImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 5,
  },
  playlistName: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
