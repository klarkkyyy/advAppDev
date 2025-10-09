import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BottomNav from "../../components/BottomNav";

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

  const ProfileHeader = () => (
    <>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/catpfp.png")}
          style={styles.profileImage}
        />
        
        <Text style={styles.username}>Karl Medina</Text>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>120</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>80</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>My Playlists</Text>
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={ProfileHeader}
        data={playlists}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
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
              source={typeof item.image === "string" ? { uri: item.image } : item.image}
              style={styles.playlistImage}
            />
            <Text style={styles.playlistName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      />
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Spotify dark background
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
    color: 'white',
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
    color: 'white',
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'gray',
    fontSize: 12,
  },
  editButton: {
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: 'white',
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
    color: 'white',
    fontWeight: 'bold',
  },
});
