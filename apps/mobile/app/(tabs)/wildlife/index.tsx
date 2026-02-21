import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link, Stack } from 'expo-router';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

import { Text, View } from '@/src/components/Themed';
import { db } from '@/src/config/firebase';
import { Wildlife } from '@/src/types/wildlife';

export default function WildlifeListScreen() {
  const [wildlife, setWildlife] = useState<Wildlife[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWildlife = async () => {
      try {
        const q = query(collection(db, 'wildlife'), orderBy('name'));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as Wildlife[];
        setWildlife(items);
      } catch (error) {
        console.error("Error fetching wildlife:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWildlife();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Wildlife Catalog' }} />
      <FlatList
        data={wildlife}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/wildlife/${item.id}`} asChild>
            <TouchableOpacity style={styles.item}>
              <Text style={styles.title}>{item.name}</Text>
              {item.species_count && (
                <Text style={styles.subtitle}>{item.species_count} species</Text>
              )}
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
