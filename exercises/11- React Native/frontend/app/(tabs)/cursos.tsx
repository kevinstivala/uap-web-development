// ...existing code...
import React from 'react';
import { View, ScrollView, Text, Pressable, Alert, Platform } from 'react-native';
import CursoCard from '../../components/CursoCard';
import cursos from '@/data/cursos.json';
import { clearAllProgress } from '@/services/storage';

export default function CursosScreen() {
  async function runClearAll() {
    try {
      console.log('Ejecutando clearAllProgress...');
      await clearAllProgress();
      console.log('clearAllProgress completado');
      if (Platform.OS === 'web') {
        window.alert('Se eliminaron todos los progresos');
      } else {
        Alert.alert('Listo', 'Se eliminaron todos los progresos');
      }
    } catch (err) {
      console.error('Error clearing progress', err);
      if (Platform.OS === 'web') {
        window.alert('Error: No se pudo eliminar los progresos');
      } else {
        Alert.alert('Error', 'No se pudo eliminar los progresos');
      }
    }
  }

  function handleClearAll() {
    console.log('handleClearAll pressed (platform:', Platform.OS, ')');
    if (Platform.OS === 'web') {
      const ok = window.confirm(
        '¿Desea eliminar todo el progreso guardado en la app? Esta acción no se puede deshacer.'
      );
      if (ok) runClearAll();
      return;
    }

    Alert.alert(
      'Eliminar todos los progresos',
      '¿Desea eliminar todo el progreso guardado en la app? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel', onPress: () => console.log('clear canceled') },
        { text: 'Eliminar', style: 'destructive', onPress: () => runClearAll() },
      ],
      { cancelable: true }
    );
  }

  return (
    <ScrollView style={{ padding: 16 }}>
      {/* Botón para depuración / reset global */}
      <Pressable
        onPress={handleClearAll}
        style={{
          marginBottom: 12,
          padding: 10,
          backgroundColor: '#d32f2f',
          borderRadius: 8,
          alignSelf: 'stretch',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '700', textAlign: 'center' }}>Eliminar todos los progresos</Text>
      </Pressable>

      <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 12 }}>Cursos Disponibles</Text>

      <View>
        {cursos.map((c: any) => (
          <CursoCard key={c.id} course={c} />
        ))}
      </View>
    </ScrollView>
  );
}
// ...existing code...