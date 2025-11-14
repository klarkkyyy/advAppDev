import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, FlatList, TouchableOpacity, Modal, TextInput, Alert, ActionSheetIOS, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BottomNav from "../../components/BottomNav";
import PhotoEditor from "../../components/PhotoEditor";
import { usePlaylistContext } from "../../contexts/PlaylistContext";
import { useProfile } from "../../contexts/ProfileContext";
import { useAppSelector } from "../../store/hooks";
import { selectThemeColors, selectAccentColor } from "../../store/themeSlice";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import * as ImagePicker from 'expo-image-picker';

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
  const { username, profileImage, setUsername, setProfileImage } = useProfile();
  const themeColors = useAppSelector(selectThemeColors);
  const accentColor = useAppSelector(selectAccentColor);

  const [showEditModal, setShowEditModal] = useState(false);
  const [tempUsername, setTempUsername] = useState("");
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [showPhotoEditor, setShowPhotoEditor] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState("");
  const [returnToEditModal, setReturnToEditModal] = useState(false);

  const colorProgress = useSharedValue(0);

  useEffect(() => {
    colorProgress.value = withTiming(1, { duration: 300 });
  }, [themeColors]);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  };

  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  };

  const pickImageFromGallery = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Please grant gallery access to change your profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImageUri(result.assets[0].uri);
      setShowImageOptions(false);
      setShowPhotoEditor(true);
    }
  };

  const takePhotoWithCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Please grant camera access to take a photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImageUri(result.assets[0].uri);
      setShowImageOptions(false);
      setShowPhotoEditor(true);
    }
  };

  const handleImageOptionPress = () => {
    // Track if we need to return to edit modal
    if (showEditModal) {
      setReturnToEditModal(true);
      setShowEditModal(false);
    }
    
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Gallery'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            takePhotoWithCamera();
          } else if (buttonIndex === 2) {
            pickImageFromGallery();
          }
        }
      );
    } else {
      setShowImageOptions(true);
    }
  };

  const handleEditProfile = () => {
    setTempUsername(username);
    setShowEditModal(true);
  };

  const handleSaveProfile = () => {
    if (tempUsername.trim()) {
      setUsername(tempUsername.trim());
      setShowEditModal(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } else {
      Alert.alert('Error', 'Username cannot be empty');
    }
  };

  const handlePhotoEditorSave = (uri: string) => {
    console.log('Saving edited photo:', uri);
    setProfileImage(uri);
    setShowPhotoEditor(false);
    
    // Reopen edit modal if we came from there
    if (returnToEditModal) {
      setShowEditModal(true);
      setReturnToEditModal(false);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: themeColors.background,
  }));

  const ProfileHeader = () => (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleImageOptionPress} activeOpacity={0.8}>
          <Image
            key={profileImage || 'default'}
            source={profileImage ? { uri: profileImage } : require("../../assets/images/catpfp.png")}
            style={styles.profileImage}
          />
          <View style={[styles.cameraIconContainer, { backgroundColor: accentColor }]}>
            <Ionicons name="camera" size={20} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
        
        <Text style={[styles.username, { color: themeColors.text }]}>{username}</Text>
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
        <TouchableOpacity 
          style={[styles.editButton, { borderColor: accentColor }]}
          onPress={handleEditProfile}
        >
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

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.editModal, { backgroundColor: themeColors.card }]}>
            <Text style={[styles.modalTitle, { color: themeColors.text }]}>Edit Profile</Text>
            
            <TouchableOpacity 
              style={styles.modalImageContainer}
              onPress={handleImageOptionPress}
            >
              <Image
                key={profileImage || 'default-modal'}
                source={profileImage ? { uri: profileImage } : require("../../assets/images/catpfp.png")}
                style={styles.modalProfileImage}
              />
              <View style={[styles.modalCameraIcon, { backgroundColor: accentColor }]}>
                <Ionicons name="camera" size={24} color="#FFFFFF" />
              </View>
              <Text style={[styles.changePhotoText, { color: accentColor }]}>Change Photo</Text>
            </TouchableOpacity>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: themeColors.text }]}>Username</Text>
              <TextInput
                style={[styles.input, { backgroundColor: themeColors.background, color: themeColors.text, borderColor: themeColors.border }]}
                value={tempUsername}
                onChangeText={setTempUsername}
                placeholder="Enter username"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { borderColor: themeColors.border }]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={[styles.cancelButtonText, { color: themeColors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton, { backgroundColor: accentColor }]}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Image Options Modal (Android) */}
      {Platform.OS === 'android' && (
        <Modal
          visible={showImageOptions}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowImageOptions(false)}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.imageOptionsModal, { backgroundColor: themeColors.card }]}>
              <Text style={[styles.modalTitle, { color: themeColors.text }]}>Select Photo</Text>
              
              <TouchableOpacity
                style={[styles.imageOptionButton, { borderColor: themeColors.border }]}
                onPress={takePhotoWithCamera}
              >
                <Ionicons name="camera" size={24} color={accentColor} />
                <Text style={[styles.imageOptionText, { color: themeColors.text }]}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.imageOptionButton, { borderColor: themeColors.border }]}
                onPress={pickImageFromGallery}
              >
                <Ionicons name="images" size={24} color={accentColor} />
                <Text style={[styles.imageOptionText, { color: themeColors.text }]}>Choose from Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.imageOptionButton, styles.cancelOptionButton]}
                onPress={() => {
                  setShowImageOptions(false);
                  // Reopen edit modal if we came from there
                  if (returnToEditModal) {
                    setShowEditModal(true);
                    setReturnToEditModal(false);
                  }
                }}
              >
                <Text style={[styles.imageOptionText, { color: themeColors.text }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Photo Editor Modal */}
      {selectedImageUri !== "" && (
        <PhotoEditor
          visible={showPhotoEditor}
          imageUri={selectedImageUri}
          onClose={() => {
            setShowPhotoEditor(false);
            // Reopen edit modal if we came from there
            if (returnToEditModal) {
              setShowEditModal(true);
              setReturnToEditModal(false);
            }
          }}
          onSave={handlePhotoEditorSave}
          accentColor={accentColor}
          themeColors={themeColors}
        />
      )}
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
  cameraIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  editModal: {
    width: '100%',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalProfileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  modalCameraIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 5,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  cancelButtonText: {
    fontWeight: '600',
  },
  saveButton: {
    // backgroundColor applied dynamically
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  imageOptionsModal: {
    width: '100%',
    borderRadius: 20,
    padding: 20,
  },
  imageOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
    gap: 15,
  },
  imageOptionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelOptionButton: {
    marginTop: 10,
    justifyContent: 'center',
  },
});
