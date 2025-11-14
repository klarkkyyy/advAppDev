import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BottomNav from "../../components/BottomNav";
import { usePlaylistContext } from "../../contexts/PlaylistContext";
import { useAppSelector } from "../../store/hooks";
import { selectThemeColors, selectAccentColor } from "../../store/themeSlice";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

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

export default function ProfileScreen() {
  const router = useRouter();
  const { playlistImages } = usePlaylistContext();
  const themeColors = useAppSelector(selectThemeColors);
  const accentColor = useAppSelector(selectAccentColor);

  const colorProgress = useSharedValue(0);

  useEffect(() => {
    colorProgress.value = withTiming(1, { duration: 300 });
  }, [themeColors]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: themeColors.background,
  }));

  const ProfileHeader = () => (
    <>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/catpfp.png")}
          style={styles.profileImage}
        />
        
        <Text style={[styles.username, { color: themeColors.text }]}>Karl Medina</Text>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: themeColors.text }]}>120</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: themeColors.text }]}>80</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.editButton, { borderColor: accentColor }]}>
          <Text style={[styles.editButtonText, { color: accentColor }]}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.sectionTitle, { color: themeColors.text }]}>My Playlists</Text>
    </>
  );

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <FlatList
        ListHeaderComponent={ProfileHeader}
        data={playlists}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.playlistCard, { backgroundColor: themeColors.card }]}
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
              source={playlistImages[item.id] || (typeof item.image === "string" ? { uri: item.image } : item.image)}
              style={styles.playlistImage}
            />
            <Text style={[styles.playlistName, { color: themeColors.text }]}>{item.name}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      />
      <BottomNav />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    marginVertical: 45,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 60,
    marginBottom: 1,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  stats: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  stat: {
    alignItems: 'center',
    marginHorizontal: 15,
  },
  statNumber: {
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'gray',
    fontSize: 12,
  },
  editButton: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  editButtonText: {
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  playlistCard: {
    width: '48%',
    marginBottom: 15,
  },
  playlistImage: {
    width: '95%',
    height: 120,
    borderRadius: 8,
    marginBottom: 5,
  },
  playlistName: {
    fontWeight: 'bold',
  },
});
