// app/home.tsx
import { StyleSheet, View } from "react-native";
import MasonryList from "react-native-masonry-list";
import BottomNav from "../../components/BottomNav";
import { useAppSelector } from "../../store/hooks";
import { selectThemeColors } from "../../store/themeSlice";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useEffect } from "react";

export default function Home() {
  const themeColors = useAppSelector(selectThemeColors);
  const colorProgress = useSharedValue(0);

  useEffect(() => {
    colorProgress.value = withTiming(1, { duration: 300 });
  }, [themeColors]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: themeColors.background,
  }));

  const images = [
    { source: require("../../assets/images/catsmile.gif"), dimensions: { width: 400, height: 300 } },
    { source: require("../../assets/images/catarmycat.gif"), dimensions: { width: 500, height: 400 } },
    { source: require("../../assets/images/coolfun.gif"), dimensions: { width: 400, height: 500 } },
    { source: require("../../assets/images/cat-army-cat.gif"), dimensions: { width: 450, height: 350 } },
    { source: require("../../assets/images/cathappy.gif"), dimensions: { width: 400, height: 400 } },
    { source: require("../../assets/images/bowlcat.gif"), dimensions: { width: 420, height: 360 } },
    { source: require("../../assets/images/catkiss.gif"), dimensions: { width: 380, height: 400 } },
    { source: require("../../assets/images/prayge.gif"), dimensions: { width: 500, height: 500 } },
    { source: require("../../assets/images/boxcat.gif"), dimensions: { width: 400, height: 420 } },
  ];

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {/* Masonry grid */}
      <MasonryList
        images={images}
        columns={2}
        spacing={6}
        imageContainerStyle={{
          borderRadius: 17,
          backgroundColor: themeColors.card,
        }}
        listContainerStyle={{
          paddingHorizontal: 8,
          backgroundColor: themeColors.background,
          paddingBottom: 70,
        }}
        backgroundColor={themeColors.background}
      />

      <BottomNav />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
