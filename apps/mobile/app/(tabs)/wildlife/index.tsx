import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

import { Text, View } from '@/src/components/Themed';

export default function WildlifeListScreen() {
  // Placeholder data
  const wildlife = [
    { id: '44', name: 'Baleine à bosse' },
    { id: '128', name: 'Antennaire' },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={wildlife}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/wildlife/${item.id}`} asChild>
            <TouchableOpacity style={styles.item}>
              <Text style={styles.title}>{item.name}</Text>
            </TouchableOpacity>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 18,
  },
});
