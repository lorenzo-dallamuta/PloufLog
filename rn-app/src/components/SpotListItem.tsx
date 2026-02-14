import { Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

import { Text, View } from '@/src/components/Themed';
import { getCountryName } from '@/src/utils/getCountryName';

export default function SpotListItem({ item }: { item: DiveSite }) {
  const router = useRouter()

  return (
    <View>
      <GestureHandlerRootView>
        <Swipeable 
          testID='dive-spot-item'
          renderRightActions={() => (
            <Pressable testID='delete-button'>
              <Text>Delete</Text>
            </Pressable>
          )}
        >
          <Pressable
            role='button'
            accessible
            accessibilityRole='button'
            accessibilityLabel={`${item.data.properties.name}, tap to view details.`}
            onPress={() => router.push({
              pathname: '/(tabs)/my-spots/[id]',
              params: { id: item.data.properties.id }
            })}
            style={styles.container}
          >
            <Text style={styles.title}>{item.data.properties.name}</Text>
            <Text>{getCountryName(item.data.properties.country_iso3)}</Text>
            <Text accessibilityLabel={`Rating: ${item.data.properties.averageRating} out of 5 stars`}>
              {item.data.properties.averageRating}⭐
            </Text>
          </Pressable>
        </Swipeable>
      </GestureHandlerRootView>
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
