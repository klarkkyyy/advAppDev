import { Text, Button, Alert, StyleSheet, ScrollView, View } from "react-native";
import { Image } from 'expo-image';

export default function Index() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        style={styles.image}
        source={{uri: 'https://media1.tenor.com/m/_WZy7E7hoTcAAAAd/cat-smile.gif'}}
        contentFit="cover"
        transition={1000}
      />
      <View style={{ height: 20 }} />  {/* Spacer  */}
      <Text>Cat</Text>
      <View style={{ height: 20 }} />  {/* Spacer */}
      <Button
          title="Press me"
          onPress={() => Alert.alert('Simple Button pressed')}
      />{/* Spacer */}
      <Image
        style={styles.image}
        source={{uri: 'https://media0.giphy.com/media/v1.Y2lkPTZjMDliOTUyYnVxdHpiODh1MTQ5OXd4Y2F3bDN5bGM4YXp6cjduOTJzMDY5dmFxdiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2zUn8hAwJwG4abiS0p/giphy.gif'}}
        contentFit="cover"
        transition={1000}
      />
      {/* Spacer */}
      <Image
        style={styles.image2}
        source={{uri: 'https://media.tenor.com/cb9L14uH-YAAAAAM/cool-fun.gif'}}
        contentFit="cover"
        transition={1000}
      />
      {/* Spacer */}
      <Image
        style={styles.image}
        source={{uri: 'https://media.tenor.com/RNHiGPiJQDYAAAAM/cat-army-cat.gif'}}
        contentFit="cover"
        transition={1000}
      />
      {/* Spacer */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,               
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  image: {
    width: '80%',
    height: 200,              
  },
  image2: {
    width: '80%',
    height: 1000,             
  },
});
