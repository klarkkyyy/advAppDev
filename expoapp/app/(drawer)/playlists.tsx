// app/(drawer)/playlists.tsx
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import BottomNav from "../../components/BottomNav";
import { usePlaylistContext } from "../../contexts/PlaylistContext";
import { useAppSelector } from "../../store/hooks";
import { selectThemeColors, selectAccentColor } from "../../store/themeSlice";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

const initialPlaylists = [
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
  const router = useRouter();
  const { playlistImages } = usePlaylistContext();
  const themeColors = useAppSelector(selectThemeColors);
  const accentColor = useAppSelector(selectAccentColor);
  const [playlists, setPlaylists] = useState(initialPlaylists);
  const [searchText, setSearchText] = useState('');
  
  const colorProgress = useSharedValue(0);

  useEffect(() => {
    colorProgress.value = withTiming(1, { duration: 300 });
  }, [themeColors]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: themeColors.background,
  }));

  const filteredPlaylists = playlists.filter(playlist =>
    playlist.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const createPlaylist = () => {
    Alert.prompt(
      'Create Playlist',
      'Enter playlist name',
      (text) => {
        if (text && text.trim()) {
          const newId = (playlists.length + 1).toString();
          const newPlaylist = {
            id: newId,
            name: text.trim(),
            image: require("../../assets/images/default.jpg"), 
          };
          setPlaylists([...playlists, newPlaylist]);
        }
      }
    );
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={[styles.header, { color: themeColors.text }]}>🎵 All Playlists 🎵</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: themeColors.card, color: themeColors.text }]}
          placeholder="Search playlists..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={[styles.createButton, { backgroundColor: themeColors.card }]} onPress={createPlaylist}>
          <Ionicons name="add" size={24} color={accentColor} />
        </TouchableOpacity>
      </View>
      <FlatList
        style={{ backgroundColor: themeColors.background }}
        data={filteredPlaylists}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.playlistCard}
            activeOpacity={0.7}
            onPress={() =>
              router.push({
                pathname: "/playlist-detail",
                params: {
                  id: item.id,
                  name: item.name,
                },
              })
            }
          >
            <Image 
              source={playlistImages[item.id] || item.image} 
              style={styles.playlistImage} 
            />
            <Text style={[styles.playlistName, { color: themeColors.text }]}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <BottomNav />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 10,
  },
  createButton: {
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistCard: {
    width: "48%",
    marginBottom: 16,
  },
  playlistImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  playlistName: {
    fontSize: 14,
    textAlign: "center",
  },
});
