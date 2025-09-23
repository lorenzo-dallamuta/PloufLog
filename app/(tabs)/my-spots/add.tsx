import { StyleSheet } from 'react-native';

import { Text, View } from '@/src/components/Themed';

export default function AddSpotScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Spot - Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
