// app/playlist-detail.tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useReducer, useEffect } from 'react';
import {
  Animated,
  Image,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { playlistSongs } from '../data/songs';
import { usePlaylistContext } from '../contexts/PlaylistContext';
import Reanimated, { FadeIn, FadeOut } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Available images for selection
const availableImages = [
  { id: 'chill', name: 'Chill Vibes', source: require("../assets/images/chill.jpg") },
  { id: 'workout', name: 'Workout', source: require("../assets/images/workout.jpg") },
  { id: 'topHits', name: 'Top Hits', source: require("../assets/images/topHits.jpg") },
  { id: 'indie', name: 'Indie', source: require("../assets/images/indie.jpg") },
  { id: 'jazz', name: 'Jazz', source: require("../assets/images/jazz.jpg") },
  { id: 'classical', name: 'Classical', source: require("../assets/images/classical.jpg") },
  { id: 'hiphop', name: 'Hip Hop', source: require("../assets/images/hiphop.jpg") },
  { id: 'party', name: 'Party Mix', source: require("../assets/images/party.jpg") },
  { id: 'acoustic', name: 'Acoustic', source: require("../assets/images/acoustic.jpg") },
  { id: 'lofi', name: 'Lo-fi', source: require("../assets/images/lofi.jpg") },
  { id: 'pop', name: 'Pop', source: require("../assets/images/pop.jpg") },
  { id: 'rock', name: 'Rock', source: require("../assets/images/rock.jpg") },
];

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

// Song Management Types
type Song = {
  id: string;
  title: string;
  artist: string;
  duration: string;
  spotifyId?: string;
  previewUrl?: string;
};

type SongAction =
  | { type: 'ADD_SONG'; payload: Song }
  | { type: 'REMOVE_SONG'; payload: string }
  | { type: 'CLEAR_PLAYLIST' }
  | { type: 'UNDO_LAST_ACTION' }
  | { type: 'REDO_LAST_ACTION' }
  | { type: 'LOAD_SONGS'; payload: Song[] | SongState };

interface SongState {
  songs: Song[];
  history: Song[][];
  future: Song[][];
}

function songReducer(state: SongState, action: SongAction): SongState {
  switch (action.type) {
    case 'ADD_SONG':
      return {
        ...state,
        songs: [...state.songs, action.payload],
        history: [...state.history, [...state.songs]],
        future: [],
      };
    case 'REMOVE_SONG':
      const newSongs = state.songs.filter((song) => song.id !== action.payload);
      return {
        ...state,
        songs: newSongs,
        history: [...state.history, [...state.songs]],
        future: [],
      };
    case 'CLEAR_PLAYLIST':
      return {
        ...state,
        songs: [],
        history: [...state.history, [...state.songs]],
        future: [],
      };
    case 'UNDO_LAST_ACTION':
      if (state.history.length === 0) return state;
      const previousState = state.history[state.history.length - 1];
      const newHistory = state.history.slice(0, -1);
      return {
        ...state,
        songs: [...previousState],
        history: newHistory,
        future: [[...state.songs], ...state.future],
      };
    case 'REDO_LAST_ACTION':
      if (state.future.length === 0) return state;
      const nextState = state.future[0];
      const newFuture = state.future.slice(1);
      return {
        ...state,
        songs: [...nextState],
        history: [...state.history, [...state.songs]],
        future: newFuture,
      };
    case 'LOAD_SONGS':
      // Handle both array and full state object
      if (Array.isArray(action.payload)) {
        return {
          songs: action.payload,
          history: [],
          future: [],
        };
      } else {
        return {
          songs: action.payload.songs || [],
          history: action.payload.history || [],
          future: action.payload.future || [],
        };
      }
    default:
      return state;
  }
}

// Playlist data
const playlists = [
  { id: "1", name: "Chill Vibes", description: "Relaxing tunes to unwind", image: require("../assets/images/chill.jpg") },
  { id: "2", name: "Workout", description: "High-energy tracks for your workout", image: require("../assets/images/workout.jpg") },
  { id: "3", name: "Top Hits", description: "Currently trending songs", image: require("../assets/images/topHits.jpg") },
  { id: "4", name: "Indie", description: "Best independent artists", image: require("../assets/images/indie.jpg") },
  { id: "5", name: "Jazz", description: "Classic and modern jazz", image: require("../assets/images/jazz.jpg") },
  { id: "6", name: "Classical Essentials", description: "Timeless classical pieces", image: require("../assets/images/classical.jpg") },
  { id: "7", name: "Hip Hop Beats", description: "Latest hip hop tracks", image: require("../assets/images/hiphop.jpg") },
  { id: "8", name: "Party Mix", description: "Party anthems and dance hits", image: require("../assets/images/party.jpg") },
  { id: "9", name: "Acoustic Mornings", description: "Peaceful acoustic melodies", image: require("../assets/images/acoustic.jpg") },
  { id: "10", name: "Lo-fi Study", description: "Focus music for studying", image: require("../assets/images/lofi.jpg") },
  { id: "11", name: "Pop Classics", description: "Timeless pop hits", image: require("../assets/images/pop.jpg") },
  { id: "12", name: "Rock Legends", description: "Classic rock anthems", image: require("../assets/images/rock.jpg") },
];

export default function PlaylistDetailScreen() {
  const { id, name } = useLocalSearchParams();
  const router = useRouter();
  const { playlistImages, customImages, updatePlaylistImage, addCustomImage } = usePlaylistContext();
  const [scrollY] = useState(() => new Animated.Value(0));
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showAddSong, setShowAddSong] = useState(false);
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [songDuration, setSongDuration] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const STORAGE_KEY = `@playlist_${id}_state`;

  const playlist = playlists.find((p) => p.id === id);
  const isCustomPlaylist = !playlist && name;
  
  // For custom playlists, try to find matching image from library playlists
  const getCustomPlaylistImage = () => {
    // Check if there's a saved custom image first
    if (playlistImages[id as string]) {
      return playlistImages[id as string];
    }
    
    // For user-added playlists (not in predefined list), use default image
    // This matches what's shown in the library
    return require("../assets/images/default.jpg");
  };
  
  const customPlaylist = isCustomPlaylist ? {
    id: id as string,
    name: name as string,
    description: "Custom Playlist",
    image: getCustomPlaylistImage()
  } : null;
  const currentPlaylist = playlist || customPlaylist;
  
  // Initialize song state with existing songs or empty array
  const initialSongs = playlist ? (playlistSongs[id as keyof typeof playlistSongs] || []) : [];
  const [songState, dispatch] = useReducer(songReducer, {
    songs: initialSongs,
    history: [],
    future: [],
  });
  
  const songs = songState.songs;

  // Load playlist state from AsyncStorage on mount
  useEffect(() => {
    loadPlaylistState();
  }, [id]);

  // Save playlist state to AsyncStorage whenever it changes
  useEffect(() => {
    savePlaylistState();
  }, [songState]);

  const loadPlaylistState = async () => {
    try {
      const savedState = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsedState: SongState = JSON.parse(savedState);
        // Load the complete state including history and future
        dispatch({ type: 'LOAD_SONGS', payload: parsedState });
      }
    } catch (error) {
      console.error('Failed to load playlist state:', error);
    }
  };

  const savePlaylistState = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(songState));
    } catch (error) {
      console.error('Failed to save playlist state:', error);
    }
  };

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

  const openSongInSpotify = async (song: Song) => {
    try {
      if (song.spotifyId) {
        // Try to open directly in Spotify app first
        const spotifyAppUrl = `spotify:track:${song.spotifyId}`;
        const spotifyWebUrl = `https://open.spotify.com/track/${song.spotifyId}`;
        
        // For iOS, try app URL scheme first, fallback to web
        if (Platform.OS === 'ios') {
          try {
            await WebBrowser.openBrowserAsync(spotifyAppUrl);
          } catch {
            // If app not installed, open in web
            await WebBrowser.openBrowserAsync(spotifyWebUrl);
          }
        } else {
          // For Android, use intent to open in app or fallback to web
          await WebBrowser.openBrowserAsync(spotifyAppUrl);
        }
      } else {
        // Search for the song on Spotify if no ID
        const searchQuery = encodeURIComponent(`${song.title} ${song.artist}`);
        const spotifyUrl = `https://open.spotify.com/search/${searchQuery}`;
        await WebBrowser.openBrowserAsync(spotifyUrl);
      }
    } catch (error) {
      console.error('Error opening Spotify:', error);
      Alert.alert(
        'Spotify Not Available',
        'Please make sure you have Spotify installed, or try opening the song manually.',
        [{ text: 'OK' }]
      );
    }
  };

  const playAllSongsInSpotify = async () => {
    try {
      // Get all Spotify IDs from songs
      const spotifyIds = songs
        .filter(song => song.spotifyId)
        .map(song => song.spotifyId)
        .join(',');

      if (spotifyIds) {
        // Create a Spotify URI to play multiple tracks
        const spotifyPlayUrl = `spotify:track:${songs.find(s => s.spotifyId)?.spotifyId}`;
        await WebBrowser.openBrowserAsync(spotifyPlayUrl);
        
        Alert.alert(
          'Playing in Spotify',
          'Opening first song in Spotify. You can queue the rest from there!',
          [{ text: 'OK' }]
        );
      } else if (playlist) {
        // Fallback to opening the preset playlist
        await openInSpotify();
      } else {
        Alert.alert(
          'No Spotify Links',
          'Add songs with Spotify links to play them directly.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error playing playlist:', error);
      Alert.alert('Error', 'Could not open Spotify. Please make sure it is installed.');
    }
  };

  const handleImageSelect = (imageSource: any) => {
    updatePlaylistImage(id as string, imageSource);
    setShowImagePicker(false);
  };

  const pickImageFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const imageSource = { uri: result.assets[0].uri };
      addCustomImage(imageSource);
      updatePlaylistImage(id as string, imageSource);
      setShowImagePicker(false);
    }
  };

  // Song Management Functions
  const searchSongs = async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Search Spotify first
      const spotifyResponse = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
        {
          headers: {
            'Authorization': 'Bearer YOUR_SPOTIFY_TOKEN' // We'll use iTunes as fallback
          }
        }
      ).catch(() => null);

      if (spotifyResponse && spotifyResponse.ok) {
        const spotifyData = await spotifyResponse.json();
        const spotifyResults = spotifyData.tracks.items.map((track: any) => ({
          trackId: track.id,
          trackName: track.name,
          artistName: track.artists[0].name,
          trackTimeMillis: track.duration_ms,
          artworkUrl60: track.album.images[2]?.url,
          spotifyId: track.id,
          previewUrl: track.preview_url,
          isSpotify: true,
        }));
        setSearchResults(spotifyResults);
      } else {
        // Fallback to iTunes
        const response = await fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=10`
        );
        const data = await response.json();
        setSearchResults(data.results || []);
      }
    } catch (error) {
      console.error('Error searching songs:', error);
      // Fallback to iTunes on error
      try {
        const response = await fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=10`
        );
        const data = await response.json();
        setSearchResults(data.results || []);
      } catch (fallbackError) {
        console.error('Fallback search failed:', fallbackError);
        setSearchResults([]);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const selectSongFromSearch = (result: any) => {
    const durationMs = result.trackTimeMillis;
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    setSongTitle(result.trackName);
    setSongArtist(result.artistName);
    setSongDuration(formattedDuration);
    
    // Store Spotify ID if available
    if (result.spotifyId) {
      // We'll add this to the song when it's created
      (window as any).pendingSpotifyId = result.spotifyId;
      (window as any).pendingPreviewUrl = result.previewUrl;
    }
    
    setSearchQuery('');
    setSearchResults([]);
  };

  const addSong = () => {
    if (songTitle.trim() === '' || songArtist.trim() === '') {
      Alert.alert('Error', 'Please enter both song title and artist');
      return;
    }
    const newSong: Song = {
      id: Date.now().toString(),
      title: songTitle.trim(),
      artist: songArtist.trim(),
      duration: songDuration.trim() || '0:00',
      spotifyId: (window as any).pendingSpotifyId,
      previewUrl: (window as any).pendingPreviewUrl,
    };
    
    // Clear pending Spotify data
    delete (window as any).pendingSpotifyId;
    delete (window as any).pendingPreviewUrl;
    
    dispatch({ type: 'ADD_SONG', payload: newSong });
    setSongTitle('');
    setSongArtist('');
    setSongDuration('');
    setSearchQuery('');
    setSearchResults([]);
    setShowAddSong(false);
  };

  const removeSong = (songId: string) => {
    Alert.alert(
      'Remove Song',
      'Are you sure you want to remove this song?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', onPress: () => dispatch({ type: 'REMOVE_SONG', payload: songId }), style: 'destructive' },
      ]
    );
  };

  const clearPlaylist = () => {
    Alert.alert(
      'Clear Playlist',
      'Are you sure you want to clear all songs?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', onPress: () => dispatch({ type: 'CLEAR_PLAYLIST' }), style: 'destructive' },
      ]
    );
  };

  const undoLastAction = () => {
    dispatch({ type: 'UNDO_LAST_ACTION' });
  };

  const redoLastAction = () => {
    dispatch({ type: 'REDO_LAST_ACTION' });
  };

  const currentImage = playlistImages[id as string] || currentPlaylist?.image;

  // Combine custom images from gallery with preset images
  const allAvailableImages = [...customImages, ...availableImages];

  if (!currentPlaylist) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Playlist not found</Text>
      </View>
    );
  }

  const renderSongItem = (song: typeof songs[0], index: number) => (
    <Reanimated.View
      key={song.id}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
    >
      <Pressable
        style={styles.songItem}
        onPress={() => openSongInSpotify(song)}
      >
        <View style={styles.songInfo}>
          <Text style={styles.songIndex}>{index + 1}</Text>
          <View style={styles.songTextContainer}>
            <View style={styles.songTitleRow}>
              <Text style={styles.songTitle}>{song.title}</Text>
              {song.spotifyId && (
                <Text style={styles.spotifyBadge}> ♫</Text>
              )}
            </View>
            <Text style={styles.songArtist}>{song.artist}</Text>
          </View>
        </View>
        <View style={styles.songActions}>
          <Text style={styles.songDuration}>{song.duration}</Text>
          <TouchableOpacity 
            onPress={(e) => {
              e.stopPropagation();
              removeSong(song.id);
            }} 
            style={styles.removeButton}
          >
            <Ionicons name="close-circle" size={24} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </Pressable>
    </Reanimated.View>
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
          <Pressable onPress={() => setShowImagePicker(true)} style={styles.imageContainer}>
            <Image source={currentImage} style={styles.coverImage} />
            <View style={styles.imageOverlay}>
              <Ionicons name="camera" size={32} color="#FFFFFF" />
              <Text style={styles.changeImageText}>Change Image</Text>
            </View>
          </Pressable>
          <View style={styles.headerContent}>
            <Text style={styles.title}>{currentPlaylist.name}</Text>
            <Text style={styles.description}>{currentPlaylist.description}</Text>
            <Text style={styles.songCount}>{songs.length} songs</Text>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.addButton]}
            onPress={() => setShowAddSong(true)}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Add Song</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.clearButton]}
            onPress={clearPlaylist}
            disabled={songs.length === 0}
          >
            <Ionicons name="trash" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Clear</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.undoButton]}
            onPress={undoLastAction}
            disabled={songState.history.length === 0}
          >
            <Ionicons name="arrow-undo" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Undo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.redoButton]}
            onPress={redoLastAction}
            disabled={songState.future.length === 0}
          >
            <Ionicons name="arrow-redo" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Redo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.songList}>
          {songs.length > 0 ? (
            songs.map((song, index) => renderSongItem(song, index))
          ) : (
            <View style={styles.emptyContainer}>
              <Pressable style={styles.addSongButton} onPress={() => setShowAddSong(true)}>
                <Ionicons name="add" size={48} color="#1DB954" />
                <Text style={styles.addSongText}>Add a Song</Text>
              </Pressable>
            </View>
          )}
        </View>

        <View style={styles.content}>
          {!isCustomPlaylist && (
            <Pressable
              style={[styles.playButton, Platform.OS === 'ios' && styles.playButtonIOS]}
              onPress={openInSpotify}
            >
              <Ionicons name="musical-notes" size={24} color="#FFFFFF" />
              <Text style={styles.playButtonText}>Open Playlist in Spotify</Text>
            </Pressable>
          )}
          
          {songs.length > 0 && songs.some(s => s.spotifyId) && (
            <Pressable
              style={[styles.playButton, styles.playAllButton, Platform.OS === 'ios' && styles.playButtonIOS]}
              onPress={playAllSongsInSpotify}
            >
              <Ionicons name="play" size={24} color="#FFFFFF" />
              <Text style={styles.playButtonText}>Play Songs in Spotify</Text>
            </Pressable>
          )}
        </View>
      </Animated.ScrollView>

      {/* Add Song Modal */}
      <Modal
        visible={showAddSong}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddSong(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Song</Text>
              <Pressable onPress={() => setShowAddSong(false)}>
                <Ionicons name="close" size={28} color="#FFFFFF" />
              </Pressable>
            </View>
            
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Search Songs</Text>
              <TextInput
                style={styles.input}
                placeholder="Search for a song..."
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  searchSongs(text);
                }}
              />
              
              {isSearching && (
                <Text style={styles.searchingText}>Searching...</Text>
              )}
              
              {searchResults.length > 0 && (
                <ScrollView style={styles.searchResults} nestedScrollEnabled>
                  {searchResults.map((result) => (
                    <TouchableOpacity
                      key={result.trackId}
                      style={styles.searchResultItem}
                      onPress={() => selectSongFromSearch(result)}
                    >
                      {result.artworkUrl60 && (
                        <Image
                          source={{ uri: result.artworkUrl60 }}
                          style={styles.searchResultArtwork}
                        />
                      )}
                      <View style={styles.searchResultInfo}>
                        <Text style={styles.searchResultTitle} numberOfLines={1}>
                          {result.trackName}
                        </Text>
                        <Text style={styles.searchResultArtist} numberOfLines={1}>
                          {result.artistName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
              
              <Text style={styles.inputLabel}>Song Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter song title..."
                placeholderTextColor="#666"
                value={songTitle}
                onChangeText={setSongTitle}
              />
              
              <Text style={styles.inputLabel}>Artist</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter artist name..."
                placeholderTextColor="#666"
                value={songArtist}
                onChangeText={setSongArtist}
              />
              
              <Text style={styles.inputLabel}>Duration (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 3:45"
                placeholderTextColor="#666"
                value={songDuration}
                onChangeText={setSongDuration}
              />
              
              <TouchableOpacity style={styles.submitButton} onPress={addSong}>
                <Text style={styles.submitButtonText}>Add Song</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Image Picker Modal */}
      <Modal
        visible={showImagePicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowImagePicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Playlist Image</Text>
              <Pressable onPress={() => setShowImagePicker(false)}>
                <Ionicons name="close" size={28} color="#FFFFFF" />
              </Pressable>
            </View>
            
            <Pressable style={styles.galleryButton} onPress={pickImageFromGallery}>
              <Ionicons name="images" size={24} color="#1DB954" />
              <Text style={styles.galleryButtonText}>Choose from Gallery</Text>
            </Pressable>
            
            <Text style={styles.orDivider}>OR CHOOSE FROM PRESETS</Text>
            
            <ScrollView contentContainerStyle={styles.imageGrid}>
              {allAvailableImages.map((img) => (
                <TouchableOpacity
                  key={img.id}
                  style={styles.imageOption}
                  onPress={() => handleImageSelect(img.source)}
                >
                  <Image source={img.source} style={styles.optionImage} />
                  <Text style={styles.optionName}>{img.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  imageContainer: {
    position: 'relative',
    alignSelf: 'center',
  },
  coverImage: {
    width: 200,
    height: 200,
    borderRadius: Platform.OS === 'ios' ? 8 : 10,
    marginBottom: 16,
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
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: Platform.OS === 'ios' ? 8 : 10,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  changeImageText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  galleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#1DB954',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    gap: 12,
  },
  galleryButtonText: {
    color: '#1DB954',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orDivider: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    letterSpacing: 1,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  imageOption: {
    width: '30%',
    aspectRatio: 1,
    marginBottom: 12,
  },
  optionImage: {
    width: '100%',
    height: '80%',
    borderRadius: 8,
  },
  optionName: {
    color: '#B3B3B3',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
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
  playAllButton: {
    backgroundColor: '#1DB954',
    marginBottom: 12,
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
  songTextContainer: {
    flex: 1,
  },
  songTitleRow: {
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
  spotifyBadge: {
    color: '#1DB954',
    fontSize: 14,
    marginLeft: 6,
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
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    minWidth: 80,
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: '#1DB954',
  },
  clearButton: {
    backgroundColor: '#FF6B6B',
  },
  undoButton: {
    backgroundColor: '#4ECDC4',
  },
  redoButton: {
    backgroundColor: '#9B59B6',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  removeButton: {
    padding: 4,
    marginLeft: 8,
  },
  inputSection: {
    padding: 20,
  },
  inputLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  submitButton: {
    backgroundColor: '#1DB954',
    borderRadius: 25,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchingText: {
    color: '#1DB954',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  searchResults: {
    maxHeight: 250,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  searchResultArtwork: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 12,
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  searchResultArtist: {
    color: '#B3B3B3',
    fontSize: 13,
  },
});
