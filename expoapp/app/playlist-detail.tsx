// app/playlist-detail.tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import {
  Animated,
  Image,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { playlistSongs } from '../data/songs';

// Map our IDs to actual Spotify playlist IDs
const spotifyPlaylists = {
  "1": "37i9dQZF1DX8Uebhn9wzrS",
  "2": "37i9dQZF1DX70RN3TfWWJh",
  "3": "37i9dQZF1DXcBWIGoYBM5M",
  "4": "37i9dQZF1DX2Nc3B70tvx0",
  "5": "37i9dQZF1DXbITWG1ZJKYt",
  "6": "37i9dQZF1DWWEJlAGA9gs0",
  "7": "37i9dQZF1DX0XUsuxWHRQd"
};

// Playlist data
const playlists = [
  { id: "1", name: "Chill Vibes", description: "Relaxing tunes to unwind", image: require("../assets/images/chill.jpg") },
  { id: "2", name: "Workout", description: "High-energy tracks for your workout", image: require("../assets/images/workout.jpg") },
  { id: "3", name: "Top Hits", description: "Currently trending songs", image: require("../assets/images/topHits.jpg") },
  { id: "4", name: "Indie", description: "Best independent artists", image: require("../assets/images/indie.jpg") },
  { id: "5", name: "Jazz", description: "Classic and modern jazz", image: require("../assets/images/jazz.jpg") },
  { id: "6", name: "Classical Essentials", description: "Timeless classical pieces", image: require("../assets/images/classical.jpg") },
  { id: "7", name: "Hip Hop Beats", description: "Latest hip hop tracks", image: require("../assets/images/hiphop.jpg") },
];

export default function PlaylistDetailScreen() {
  const { id, name } = useLocalSearchParams();
  const router = useRouter();
  const [scrollY] = useState(() => new Animated.Value(0));

  const playlist = playlists.find((p) => p.id === id);
  const isUserPlaylist = !playlist;
  const userPlaylist = isUserPlaylist ? { id, name: name as string, description: "Your custom playlist", image: require("../assets/images/default.jpg") } : null;
  const currentPlaylist = playlist || userPlaylist;
  const songs = isUserPlaylist ? [] : (playlistSongs[id as keyof typeof playlistSongs] || []);

  // Animated header values
  const HEADER_HEIGHT = Platform.OS === 'ios' ? 280 : 260;
  const headerScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.5, 1],
    extrapolate: 'clamp',
  });
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const openInSpotify = async () => {
    try {
      const spotifyId = spotifyPlaylists[id as keyof typeof spotifyPlaylists];
      const spotifyUrl =
        Platform.OS === 'ios'
          ? `https://open.spotify.com/playlist/${spotifyId}`
          : `spotify:playlist:${spotifyId}`;
      await WebBrowser.openBrowserAsync(spotifyUrl);
    } catch (error) {
      alert('Could not open Spotify. Please make sure you have Spotify installed.');
    }
  };

  if (!currentPlaylist) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Playlist not found</Text>
      </View>
    );
  }

  const renderSongItem = (song: typeof songs[0], index: number) => (
    <Pressable
      key={song.id}
      style={styles.songItem}
      onPress={openInSpotify}
    >
      <View style={styles.songInfo}>
        <Text style={styles.songIndex}>{index + 1}</Text>
        <View>
          <Text style={styles.songTitle}>{song.title}</Text>
          <Text style={styles.songArtist}>{song.artist}</Text>
        </View>
      </View>
      <View style={styles.songActions}>
        <Text style={styles.songDuration}>{song.duration}</Text>
        <Ionicons name="ellipsis-horizontal" size={20} color="#B3B3B3" />
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Back Button */}
      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
      </Pressable>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: Platform.OS === 'ios' ? 44 : 0 }}
      >
        <Animated.View
          style={[
            styles.header,
            {
              transform: [{ scale: headerScale }],
              opacity: headerOpacity,
              height: HEADER_HEIGHT,
            },
          ]}
        >
          <Image source={currentPlaylist.image} style={styles.coverImage} />
          <View style={styles.headerContent}>
            <Text style={styles.title}>{currentPlaylist.name}</Text>
            <Text style={styles.description}>{currentPlaylist.description}</Text>
            <Text style={styles.songCount}>{songs.length} songs</Text>
          </View>
        </Animated.View>

        <View style={styles.songList}>
          {songs.length > 0 ? (
            songs.map((song, index) => renderSongItem(song, index))
          ) : (
            <View style={styles.emptyContainer}>
              <Pressable style={styles.addSongButton} onPress={() => alert('Add song functionality')}>
                <Ionicons name="add" size={48} color="#1DB954" />
                <Text style={styles.addSongText}>Add a Song</Text>
              </Pressable>
            </View>
          )}
        </View>

        <View style={styles.content}>
          {!isUserPlaylist && (
            <Pressable
              style={[styles.playButton, Platform.OS === 'ios' && styles.playButtonIOS]}
              onPress={openInSpotify}
            >
              <Ionicons name="musical-notes" size={24} color="#FFFFFF" />
              <Text style={styles.playButtonText}>Open in Spotify</Text>
            </Pressable>
          )}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 4,
  },
  header: {
    backgroundColor: '#121212',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  coverImage: {
    width: 200,
    height: 200,
    borderRadius: Platform.OS === 'ios' ? 8 : 10,
    marginBottom: 16,
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  title: {
    fontSize: 24,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#B3B3B3',
    marginBottom: 4,
  },
  songCount: {
    fontSize: 14,
    color: '#B3B3B3',
  },
  content: {
    padding: 20,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1DB954',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignSelf: 'center',
    marginBottom: 24,
  },
  playButtonIOS: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    marginLeft: 8,
  },
  songList: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#333',
  },
  songInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  songIndex: {
    color: '#B3B3B3',
    fontSize: 16,
    width: 32,
  },
  songTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 4,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
  songArtist: {
    color: '#B3B3B3',
    fontSize: 14,
  },
  songActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  songDuration: {
    color: '#B3B3B3',
    fontSize: 14,
    marginRight: 16,
  },
  error: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  addSongButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  addSongText: {
    color: '#1DB954',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
});
