import { Stack } from 'expo-router';

export default function MySpotsStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'My Spots' }} />
      <Stack.Screen name="add" options={{ title: 'Add Spot' }} />
      <Stack.Screen name="[id]" options={{ title: 'Spot Details' }} />
    </Stack>
  );
}