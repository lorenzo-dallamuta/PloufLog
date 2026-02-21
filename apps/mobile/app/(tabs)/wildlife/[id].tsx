import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';

import { Text, View } from '@/src/components/Themed';

export default function WildlifeDetailsScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Wildlife ${id}` }} />
      <ScrollView>
        <Text style={styles.title}>Wildlife ID: {id}</Text>
        <Text style={styles.content}>Prototype details page will be implemented here.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
  },
  content: {
    fontSize: 16,
    marginHorizontal: 20,
  },
});
