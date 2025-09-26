import { StyleSheet } from 'react-native';

import { Text, View } from '@/src/components/Themed';
import { getCountryName } from '../utils/getCountryName';

export default function SpotListItem({ item }: { item: DiveSite }) {
  return (
    <View
      testID='dive-spot-item'
      style={styles.container}
    >
      <Text style={styles.title}>{item.data.properties.name}</Text>
      <Text>{getCountryName(item.data.properties.country_iso3)}</Text>
      <Text accessibilityLabel={`Rating: ${item.data.properties.averageRating} out of 5 stars`}>
        {item.data.properties.averageRating}⭐
      </Text>
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
