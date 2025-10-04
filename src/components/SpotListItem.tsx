import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

import { Text, View } from '@/src/components/Themed';
import { getCountryName } from '@/src/utils/getCountryName';

export default function SpotListItem({ item }: { item: DiveSite }) {
  const router = useRouter()

  const [showDeleteButton, setShowDeleteButton] = useState(false);

  return (
    <View>
      <GestureHandlerRootView>
        <Swipeable 
          testID='dive-spot-item'
          onSwipeableOpen={() => setShowDeleteButton(true)}
          onSwipeableClose={() => setShowDeleteButton(false)}
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
      {showDeleteButton && (
        <Pressable testID='delete-button'>
          <Text>Delete</Text>
        </Pressable>
      )}
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
