import { StyleSheet } from 'react-native';

import { Text, View } from '@/src/components/Themed';

export default function SpotListItem({ item }: { item: DiveSite }) {
  return (
    <View
      testID='dive-spot-item'
      style={styles.container}
      >
      <Text style={styles.title}>Spot List Item - Coming Soon</Text>
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
