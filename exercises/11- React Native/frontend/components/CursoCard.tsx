import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function CursoCard({ course }: { course: any }) {
  const router = useRouter();

  function openCourse() {
    // ruta correspondiente a app/cursos/[id].tsx
    router.push(`/cursos/${course.id}`);
  }

  return (
    <Pressable onPress={openCourse} style={{ padding: 12, borderRadius: 8, marginBottom: 12, backgroundColor: '#fff' }}>
      {course.image ? (
        <Image source={{ uri: course.image }} style={{ height: 120, borderRadius: 6, resizeMode: 'cover' }} />
      ) : null}
      <Text style={{ fontSize: 18, fontWeight: '700', marginTop: 8 }}>{course.title}</Text>
      {course.description ? <Text style={{ color: '#666', marginTop: 4 }}>{course.description}</Text> : null}
    </Pressable>
  );
}