import React, { useReducer, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Action types
type Action =
  | { type: 'ADD_SONG'; payload: string }
  | { type: 'REMOVE_SONG'; payload: number }
  | { type: 'CLEAR_PLAYLIST' }
  | { type: 'UNDO_LAST_ACTION' };

// State interface
interface PlaylistState {
  songs: string[];
  history: string[][];
}

// Initial state
const initialState: PlaylistState = {
  songs: [],
  history: [],
};

// Reducer function
function playlistReducer(state: PlaylistState, action: Action): PlaylistState {
  switch (action.type) {
    case 'ADD_SONG':
      return {
        ...state,
        songs: [...state.songs, action.payload],
        history: [...state.history, [...state.songs]],
      };
    case 'REMOVE_SONG':
      const newSongs = state.songs.filter((_, index) => index !== action.payload);
      return {
        ...state,
        songs: newSongs,
        history: [...state.history, [...state.songs]],
      };
    case 'CLEAR_PLAYLIST':
      return {
        ...state,
        songs: [],
        history: [...state.history, [...state.songs]],
      };
    case 'UNDO_LAST_ACTION':
      if (state.history.length === 0) return state;
      const previousState = state.history[state.history.length - 1];
      const newHistory = state.history.slice(0, -1);
      return {
        ...state,
        songs: [...previousState],
        history: newHistory,
      };
    default:
      return state;
  }
}

export default function CreatePlaylistScreen() {
  const [state, dispatch] = useReducer(playlistReducer, initialState);
  const [songInput, setSongInput] = useState('');
  const [animationValue] = useState(new Animated.Value(0));
  const router = useRouter();

  const addSong = () => {
    if (songInput.trim() === '') {
      Alert.alert('Error', 'Please enter a song name');
      return;
    }
    dispatch({ type: 'ADD_SONG', payload: songInput.trim() });
    setSongInput('');

    // Animate the addition
    Animated.sequence([
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animationValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const removeSong = (index: number) => {
    dispatch({ type: 'REMOVE_SONG', payload: index });
  };

  const clearPlaylist = () => {
    Alert.alert(
      'Clear Playlist',
      'Are you sure you want to clear all songs?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', onPress: () => dispatch({ type: 'CLEAR_PLAYLIST' }) },
      ]
    );
  };

  const undoLastAction = () => {
    dispatch({ type: 'UNDO_LAST_ACTION' });
  };

  const renderSongItem = ({ item, index }: { item: string; index: number }) => (
    <Animated.View
      style={[
        styles.songItem,
        {
          transform: [
            {
              scale: animationValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.05],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.songInfo}>
        <Text style={styles.songNumber}>{index + 1}</Text>
        <Text style={styles.songTitle}>{item}</Text>
      </View>
      <TouchableOpacity
        onPress={() => removeSong(index)}
        style={styles.removeButton}
      >
        <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Playlist</Text>
      </View>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter song name..."
          placeholderTextColor="#B3B3B3"
          value={songInput}
          onChangeText={setSongInput}
          onSubmitEditing={addSong}
        />
        <TouchableOpacity style={styles.addButton} onPress={addSong}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.clearButton]}
          onPress={clearPlaylist}
          disabled={state.songs.length === 0}
        >
          <Ionicons name="trash" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Clear</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.undoButton]}
          onPress={undoLastAction}
          disabled={state.history.length === 0}
        >
          <Ionicons name="arrow-undo" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Undo</Text>
        </TouchableOpacity>
      </View>

      {/* Playlist Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {state.songs.length} song{state.songs.length !== 1 ? 's' : ''} in playlist
        </Text>
      </View>

      {/* Song List */}
      <FlatList
        data={state.songs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderSongItem}
        style={styles.songList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="musical-notes-outline" size={64} color="#B3B3B3" />
            <Text style={styles.emptyText}>No songs added yet</Text>
            <Text style={styles.emptySubtext}>Add your first song above!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#1DB954',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    minWidth: 100,
    justifyContent: 'center',
  },
  clearButton: {
    backgroundColor: '#FF6B6B',
  },
  undoButton: {
    backgroundColor: '#4ECDC4',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  statsText: {
    color: '#B3B3B3',
    fontSize: 14,
  },
  songList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  songItem: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  songInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  songNumber: {
    color: '#1DB954',
    fontSize: 16,
    fontWeight: 'bold',
    width: 30,
  },
  songTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  removeButton: {
    padding: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    color: '#B3B3B3',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 20,
  },
  emptySubtext: {
    color: '#888888',
    fontSize: 14,
    marginTop: 5,
  },
});
