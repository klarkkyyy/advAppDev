declare module 'react-native-masonry-list' {
  import { Component } from 'react';
  import { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';

  export interface MasonryListImage {
    source: ImageSourcePropType;
    dimensions: {
      width: number;
      height: number;
    };
  }

  export interface MasonryListProps {
    images: MasonryListImage[];
    columns?: number;
    spacing?: number;
    imageContainerStyle?: StyleProp<ViewStyle>;
    listContainerStyle?: StyleProp<ViewStyle>;
    backgroundColor?: string;
  }

  export default class MasonryList extends Component<MasonryListProps> {}
}
