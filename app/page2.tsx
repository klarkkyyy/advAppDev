import { Text, View, Button } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Cat</Text>
      <Button title="Press Me!" onPress={handlePress} />
    </View>
  );
}
