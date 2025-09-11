import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from "expo-router";

type StackParamList = {
  Profile: undefined;
  Settings: undefined;
  Playlists: undefined;
  Home: undefined;
};

export default function DrawerContent() {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const router = useRouter();
  return (
    <View style={styles.container}>
        {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/home')}>
        <FontAwesome name="arrow-left" size={24} color="white" />
      </TouchableOpacity>
      {/* Profile Section */}
      <TouchableOpacity 
        style={styles.profileSection} 
        // onPress={() => navigation.navigate('Profile')}
        onPress={() => router.push('/profile')}
      >
        <Image
          source={require("../assets/images/catpfp.png")}
          style={styles.profileImage}
        />
        <View style={styles.nameContainer}>
            <Text style={styles.profileName}>Karl Medina</Text>
            <Text style={styles.view}>View Profile</Text>
        </View>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Settings */}
      <TouchableOpacity 
        style={styles.menuItem} 
        onPress={() => router.push('/playlists')}
      >
        <Text style={styles.menuText}>Settings</Text>
      </TouchableOpacity>

      {/* My Playlists */}
      <TouchableOpacity 
        style={styles.menuItem} 
        onPress={() => router.push('/playlists')}
      >
        <Text style={styles.menuText}>My Playlists</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 70,
    paddingHorizontal: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  profileName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: 'gray',
    marginBottom: 20,
  },
  menuItem: {
    paddingVertical: 15,
  },
  menuText: {
    color: 'white',
    fontSize: 16,
  },

  view: {
    color: "#888",
    fontSize: 14,
    fontWeight: "500",
  },
    nameContainer: {
    flexDirection: 'column',
  },
  backButton: {
    marginVertical: 10,
    marginBottom: 30,
  },

});
