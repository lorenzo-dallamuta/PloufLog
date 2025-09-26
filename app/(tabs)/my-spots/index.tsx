import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';

import { Text, View } from '@/src/components/Themed';
import { useDiveSiteIsLoading, useDiveSiteList } from '@/src/store/useDiveSiteStore';

export default function SpotListScreen() {
  const diveSiteList = useDiveSiteList();
  const diveSiteIsLoading = useDiveSiteIsLoading();

  if (diveSiteIsLoading) {
    return (
      <ActivityIndicator
        accessibilityHint='loading-spinner'
        role='progressbar'
        accessible
      />
    );
  };

  if (diveSiteList.length === 0) {
    return (
      <View style={styles.container}>
        <Text
          testID='empty-list'
          accessibilityLabel='No dive spots'
          accessibilityRole='text'
          accessible
          style={styles.title}
        >
          Add a dive spot to see it in your list
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList 
        data={diveSiteList}
        renderItem={({item}) => (
          <Text
            testID='dive-spot-item'
            style={styles.title}
          >
            {item.data.properties.id}
          </Text>
        )}
        keyExtractor={item => item.data.properties.id}
        accessible
        accessibilityLabel={`My dive spots, ${diveSiteList.length} items`}
        role='list'
      />
    </View>
  );
};

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
