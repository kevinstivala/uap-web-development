import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import courses from '../../data/cursos.json';
import { loadProgress, saveProgress, clearProgress } from '@/services/storage';

export default function CoursePlayer() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation: any = useNavigation();
  const course = courses.find((c: any) => c.id === id);

  const [index, setIndex] = useState<number>(0);
  const [progress, setProgress] = useState<any>(null);
  const [selectedChoice, setSelectedChoice] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const totalQuestions = course?.questions?.length ?? 0;

  useLayoutEffect(() => {
    if (course) {
      navigation.setOptions({ title: `Curso: ${course.title}` });
    }
  }, [navigation, course]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (!id) {
        setLoading(false);
        return;
      }
      const p = await loadProgress(String(id));
      if (p) {
        const idx = typeof p.currentIndex === 'number' ? p.currentIndex : 0;
        setProgress(p);
        setIndex(idx);
      } else {
        const init = { status: 'in-progress', currentIndex: 0, answers: [], startedAt: Date.now() };
        await saveProgress(String(id), init);
        setProgress(init);
        setIndex(0);
      }
      setLoading(false);
    })();
  }, [id]);

  // si ya está completado -> derivar a pantalla de resultado
  useEffect(() => {
    if (!loading && progress?.status === 'completed') {
      router.replace(`/cursos/resultado?courseId=${id}&status=completed`);
    }
  }, [loading, progress, id, router]);

  useEffect(() => {
    setSelectedChoice(null);
  }, [index]);

  if (loading) return <Text style={{ padding: 16 }}>Cargando...</Text>;
  if (!course) return <Text style={{ padding: 16 }}>Curso no encontrado</Text>;
  if (progress?.status === 'completed') return null; // espera redirect en useEffect

  const currentQuestion = course.questions[index];
  if (!currentQuestion) return <Text style={{ padding: 16 }}>No hay más preguntas</Text>;

  function handleSelectChoice(choice: any) {
    setSelectedChoice(choice);
  }

  // guarda respuesta y, si completa, marca completed (sin calcular estadísticas aquí)
  async function handleContinueFromReflection() {
    if (!currentQuestion || !selectedChoice) return;
    const wasCorrect = !!selectedChoice.correct;
    const newAnswers = [...(progress?.answers || []), { qId: currentQuestion.id, choiceId: selectedChoice.id, correct: wasCorrect }];
    const nextIndex = index + 1;
    const isNowCompleted = nextIndex >= totalQuestions;

    const newProgress: any = {
      ...(progress || {}),
      currentIndex: nextIndex,
      answers: newAnswers,
      status: isNowCompleted ? 'completed' : 'in-progress',
      completedAt: isNowCompleted ? Date.now() : progress?.completedAt,
    };

    await saveProgress(String(id), newProgress);
    setProgress(newProgress);
    setSelectedChoice(null);

    if (isNowCompleted) {
      // derivar a pantalla de resultado; cálculo lo hace resultado.tsx
      router.replace(`/cursos/resultado?courseId=${id}&status=completed`);
    } else {
      setIndex(nextIndex);
    }
  }

  async function confirmReset() {
    try {
      await clearProgress(String(id));
      const init = { status: 'in-progress', currentIndex: 0, answers: [], startedAt: Date.now() };
      await saveProgress(String(id), init);
      setProgress(init);
      setIndex(0);
      setSelectedChoice(null);
      if (Platform.OS === 'web') window.alert('Progreso reiniciado');
      else Alert.alert('Listo', 'Progreso reiniciado');
    } catch (err) {
      console.error('reset error', err);
      if (Platform.OS === 'web') window.alert('Error reiniciando progreso');
      else Alert.alert('Error', 'No fue posible reiniciar el progreso');
    }
  }

  const pageTitle = `Pregunta ${Math.min(index + 1, totalQuestions)}/${totalQuestions}`;

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>{pageTitle}</Text>

      <Pressable onPress={confirmReset} style={styles.resetButton}>
        <Text style={styles.resetText}>Reiniciar progreso</Text>
      </Pressable>

      <Text style={styles.verse}>{currentQuestion.verse}</Text>
      <Text style={styles.question}>{currentQuestion.text}</Text>

      {selectedChoice ? (
        <View style={styles.reflectionCard}>
          <Text style={styles.reflectionTitle}>{selectedChoice.correct ? 'Reflexión (Correcto)' : 'Reflexión'}</Text>
          <Text style={styles.reflectionText}>{selectedChoice.reflection}</Text>
          <Pressable onPress={handleContinueFromReflection} style={styles.continueButton}>
            <Text style={styles.continueText}>Continuar</Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ marginTop: 16 }}>
          {currentQuestion.choices.map((ch: any) => (
            <Pressable key={ch.id} onPress={() => handleSelectChoice(ch)} style={styles.choice}>
              <Text>{ch.text}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  pageTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  resetButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#d32f2f',
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  resetText: { color: '#fff', fontWeight: '700' },
  verse: { marginTop: 12, fontStyle: 'italic' },
  question: { marginTop: 8 },
  choice: { padding: 12, backgroundColor: '#eee', marginBottom: 8, borderRadius: 6 },
  reflectionCard: { marginTop: 16, backgroundColor: '#fff', padding: 16, borderRadius: 8, elevation: 2 },
  reflectionTitle: { fontWeight: '700', marginBottom: 8 },
  reflectionText: { marginBottom: 12 },
  continueButton: { backgroundColor: '#1f6feb', padding: 12, borderRadius: 6, alignItems: 'center' },
  continueText: { color: '#fff', fontWeight: '700' },
});