// contexts/PlaylistContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PlaylistImage {
  [playlistId: string]: any;
}

interface CustomImage {
  id: string;
  name: string;
  source: any;
}

interface PlaylistContextType {
  playlistImages: PlaylistImage;
  customImages: CustomImage[];
  updatePlaylistImage: (playlistId: string, imageSource: any) => void;
  addCustomImage: (imageSource: any) => void;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export function PlaylistProvider({ children }: { children: ReactNode }) {
  const [playlistImages, setPlaylistImages] = useState<PlaylistImage>({});
  const [customImages, setCustomImages] = useState<CustomImage[]>([]);

  const updatePlaylistImage = (playlistId: string, imageSource: any) => {
    setPlaylistImages(prev => ({
      ...prev,
      [playlistId]: imageSource,
    }));
  };

  const addCustomImage = (imageSource: any) => {
    const newImage: CustomImage = {
      id: `custom-${Date.now()}`,
      name: 'Custom Photo',
      source: imageSource,
    };
    setCustomImages(prev => [newImage, ...prev]);
  };

  return (
    <PlaylistContext.Provider value={{ playlistImages, customImages, updatePlaylistImage, addCustomImage }}>
      {children}
    </PlaylistContext.Provider>
  );
}

export function usePlaylistContext() {
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error('usePlaylistContext must be used within a PlaylistProvider');
  }
  return context;
}
