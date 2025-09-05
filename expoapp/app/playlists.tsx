import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const playlists = [
  { id: '1', name: 'Chill Vibes', image: 'https://via.placeholder.com/150' },
  { id: '2', name: 'Workout', image: 'https://via.placeholder.com/150' },
  { id: '3', name: 'Top Hits', image: 'https://via.placeholder.com/150' },
  { id: '4', name: 'Indie', image: 'https://via.placeholder.com/150' },
  { id: '5', name: 'Jazz', image: 'https://via.placeholder.com/150' },
];

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/home')}>
        <FontAwesome name="arrow-left" size={24} color="white" />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("C:/Users/karlm/Documents/USC/3rdYr/AdvAppDev/advAppDev/expoapp/assets/images/catpfp.png")}
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

      {/* Playlists */}
      <Text style={styles.sectionTitle}>My Playlists</Text>
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <View style={styles.playlistCard}>
            <Image source={{ uri: item.image }} style={styles.playlistImage} />
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
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 5,
  },
  playlistName: {
    color: 'white',
    fontWeight: 'bold',
  },
});
