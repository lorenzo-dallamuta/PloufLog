import { Stack } from 'expo-router';

export default function WildlifeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Wildlife' }} />
      <Stack.Screen name="[id]" options={{ title: 'Details' }} />
    </Stack>
  );
}
