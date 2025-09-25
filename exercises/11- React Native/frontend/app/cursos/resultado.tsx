import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { loadProgress, clearProgress, saveProgress } from '@/services/storage';
import courses from '../../data/cursos.json';
import { useNavigation } from '@react-navigation/native';

export default function CourseResult() {
  const { courseId, status } = useLocalSearchParams<{ courseId: string; status: string }>();
  const router = useRouter();
  const navigation: any = useNavigation();
  const course = courses.find((c: any) => c.id === courseId);

  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // header: "Curso: (Nombre)"
  useLayoutEffect(() => {
    if (course) navigation.setOptions({ title: `Curso: ${course.title}` });
  }, [navigation, course]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (!courseId) {
        setLoading(false);
        return;
      }
      const p = await loadProgress(String(courseId));
      setProgress(p);
      setLoading(false);
    })();
  }, [courseId]);

  if (loading) return <Text style={{ padding: 16 }}>Cargando resultado...</Text>;

  // calcular estadísticas desde progress.answers
  const answers = progress?.answers ?? [];
  const total = course?.questions?.length ?? answers.length;
  const correctCount = answers.filter((a: any) => a.correct).length;
  const incorrectCount = answers.length - correctCount;
  const percent = total ? Math.round((correctCount / total) * 100) : 0;
  const passed = percent >= 70;

  async function handleRetry() {
    if (!courseId) return;
    try {
      await clearProgress(String(courseId));
      const init = { status: 'in-progress', currentIndex: 0, answers: [], startedAt: Date.now() };
      await saveProgress(String(courseId), init);
      router.replace(`/cursos/${courseId}`);
    } catch (err) {
      console.error('handleRetry error', err);
      const msg = 'No fue posible reiniciar el curso';
      Platform.OS === 'web' ? window.alert(msg) : Alert.alert('Error', msg);
    }
  }

  async function handleCertificate() {
    if (!courseId) return;
    try {
      const updated = { ...(progress || {}), certifiedAt: Date.now() };
      await saveProgress(String(courseId), updated);
      setProgress(updated);
      const msg = 'Certificado emitido (simulado)';
      Platform.OS === 'web' ? window.alert(msg) : Alert.alert('Certificado', msg);
    } catch (err) {
      console.error('certificate error', err);
      const msg = 'No fue posible emitir el certificado';
      Platform.OS === 'web' ? window.alert(msg) : Alert.alert('Error', msg);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{course?.title ?? 'Resultado del curso'}</Text>

      <View style={{ marginVertical: 12 }}>
        <Text style={styles.stat}>Respuestas correctas: {correctCount}</Text>
        <Text style={styles.stat}>Respuestas incorrectas: {incorrectCount}</Text>
        <Text style={styles.stat}>Total: {total}</Text>
        <Text style={styles.stat}>Porcentaje: {percent}%</Text>
        <Text style={[styles.stat, { fontWeight: '700' }]}>{passed ? 'Resultado: Aprobado' : 'Resultado: No aprobado'}</Text>
      </View>

      <Pressable style={styles.primary} onPress={() => router.push('/cursos')}>
        <Text style={styles.primaryText}>Volver a cursos</Text>
      </Pressable>

      {!passed ? (
        <Pressable style={styles.secondary} onPress={handleRetry}>
          <Text style={styles.secondaryText}>Reintentar</Text>
        </Pressable>
      ) : (
        <Pressable style={styles.secondary} onPress={handleCertificate}>
          <Text style={styles.secondaryText}>Obtener certificado</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  stat: { textAlign: 'center', marginBottom: 4 },
  primary: { backgroundColor: '#1f6feb', padding: 12, borderRadius: 8, marginBottom: 12 },
  primaryText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
  secondary: { borderColor: '#1f6feb', borderWidth: 1, padding: 12, borderRadius: 8 },
  secondaryText: { color: '#1f6feb', textAlign: 'center', fontWeight: '700' },
});