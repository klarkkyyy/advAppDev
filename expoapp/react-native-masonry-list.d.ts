declare module 'react-native-masonry-list' {
  import { Component } from 'react';
  import { ViewStyle, ImageStyle } from 'react-native';

  export interface MasonryListProps<T = any> {
    images: T[];
    columns?: number;
    spacing?: number;
    sorted?: boolean;
    backgroundColor?: string;
    imageContainerStyle?: ViewStyle;
    listContainerStyle?: ViewStyle;
    renderIndividualHeader?: (item: T, index: number) => React.ReactElement | null;
    renderIndividualFooter?: (item: T, index: number) => React.ReactElement | null;
    masonryFlatListColProps?: any;
    onPressImage?: (item: T, index: number) => void;
    onLongPressImage?: (item: T, index: number) => void;
    customImageComponent?: any;
    customImageProps?: any;
    completeCustomComponent?: any;
    rerender?: boolean;
  }

  export default class MasonryList<T = any> extends Component<MasonryListProps<T>> {}
}
