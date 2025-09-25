import { ActivityIndicator, StyleSheet } from 'react-native';

import { Text, View } from '@/src/components/Themed';
import { useDiveSiteIsLoading } from '@/src/store/useDiveSiteStore';

export default function SpotListScreen() {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Spots List - Coming Soon</Text>
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
