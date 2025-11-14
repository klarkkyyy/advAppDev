import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_STORAGE_KEY = '@user_profile';

interface ProfileContextType {
  username: string;
  profileImage: string | null;
  setUsername: (name: string) => void;
  setProfileImage: (uri: string | null) => void;
  loadProfile: () => Promise<void>;
  saveProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsernameState] = useState("Karl Medina");
  const [profileImage, setProfileImageState] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    saveProfile();
  }, [username, profileImage]);

  const loadProfile = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
      if (savedProfile) {
        const { username: savedUsername, profileImage: savedImage } = JSON.parse(savedProfile);
        if (savedUsername) setUsernameState(savedUsername);
        if (savedImage) setProfileImageState(savedImage);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const saveProfile = async () => {
    try {
      const profile = {
        username,
        profileImage,
      };
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  const setUsername = (name: string) => {
    setUsernameState(name);
  };

  const setProfileImage = (uri: string | null) => {
    setProfileImageState(uri);
  };

  return (
    <ProfileContext.Provider
      value={{
        username,
        profileImage,
        setUsername,
        setProfileImage,
        loadProfile,
        saveProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
};
