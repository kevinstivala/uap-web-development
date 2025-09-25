// ...existing code...
import { useRouter } from 'expo-router';
import { Pressable, Text } from 'react-native';
// ...existing code...
export default function TabIndexScreen() {
  const router = useRouter();
  // ...existing code...
  return (
    // ...existing UI...
    <>
      {/* ...existing code... */}
      <Pressable onPress={() => router.push('/cursos')} style={{ padding: 12, backgroundColor: '#1f6feb', borderRadius: 8 }}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Ver Cursos</Text>
      </Pressable>
      {/* ...existing code... */}
    </>
  );
}
// ...existing code...