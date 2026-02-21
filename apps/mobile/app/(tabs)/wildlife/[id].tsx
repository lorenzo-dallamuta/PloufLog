import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, Image, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

import { Text, View } from '@/src/components/Themed';
import { db, storage } from '@/src/config/firebase';
import { Wildlife } from '@/src/types/wildlife';

export default function WildlifeDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [wildlife, setWildlife] = useState<Wildlife | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();

  useEffect(() => {
    const fetchDetails = async () => {
      if (typeof id !== 'string') return;
      
      try {
        const docRef = doc(db, 'wildlife', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as Wildlife;
          setWildlife(data);

          // Try to get image from storage
          if (data.images && data.images.length > 0 && data.images[0].storage_path) {
            try {
              const imageRef = ref(storage, data.images[0].storage_path);
              const url = await getDownloadURL(imageRef);
              setImageUrl(url);
            } catch (err) {
              console.warn("Could not load image from storage:", err);
              // Fallback to original URL if storage fails
              if (data.images[0].url) {
                setImageUrl(data.images[0].url);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching wildlife details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!wildlife) {
    return (
      <View style={styles.center}>
        <Text>Wildlife not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: wildlife.name }} />
      <ScrollView>
        {imageUrl && (
          <Image 
            source={{ uri: imageUrl }} 
            style={[styles.image, { width: width, height: width * 0.6 }]} 
            resizeMode="cover"
          />
        )}
        
        <View style={styles.headerContent}>
          <Text style={styles.title}>{wildlife.name}</Text>
          
          {wildlife.taxonomy && (
            <View style={styles.taxonomyContainer}>
              {wildlife.taxonomy.map((tag, index) => (
                <View key={index} style={styles.badge}>
                  <Text style={styles.badgeText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {wildlife.content.map((block, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{block.title}</Text>
            <Text style={styles.sectionBody}>{block.body}</Text>
          </View>
        ))}
        
        <View style={styles.footer}>
          <Text style={styles.sourceText}>Source: {wildlife.source}</Text>
        </View>
      </ScrollView>
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
  image: {
    backgroundColor: '#eee',
  },
  headerContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  taxonomyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007AFF',
  },
  sectionBody: {
    fontSize: 16,
    lineHeight: 24,
  },
  footer: {
    padding: 20,
    alignItems: 'flex-end',
  },
  sourceText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
});
