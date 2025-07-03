import { useQueryClient } from '@tanstack/react-query';
import { useSettingsStore } from '../store/useSettingsStore';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useFetchSettings, useUpdateSettings } from '../hooks/useSettings';

export const Settings = () => {
    const {
        refetchInterval,
        upperCaseDescription,
        paginationLimit,
        setRefetchInterval,
        setUpperCaseDescription,
        setPaginationLimit,
    } = useSettingsStore();

    const { data } = useFetchSettings();
    const updateSettings = useUpdateSettings();
    const queryClient = useQueryClient();

    // Local state para edición
    const [local, setLocal] = useState({
        refetchInterval: refetchInterval,
        upperCaseDescription,
        paginationLimit,
    });

    useEffect(() => {
        setLocal({
            refetchInterval: refetchInterval,
            upperCaseDescription,
            paginationLimit,
        });
    }, [refetchInterval, upperCaseDescription, paginationLimit]);

    const handleSave = () => {
        // Validación simple
        if (local.refetchInterval < 5000 || local.refetchInterval > 30000) {
            toast.error('El intervalo debe estar entre 5 y 30 segundos');
            return;
        }
        if (local.paginationLimit < 1 || local.paginationLimit > 20) {
            toast.error('El límite debe estar entre 1 y 20');
            return;
        }
        // Actualiza el store local
        setRefetchInterval(local.refetchInterval);
        setUpperCaseDescription(local.upperCaseDescription);
        setPaginationLimit(local.paginationLimit);

        // Actualiza en el backend
        updateSettings.mutate({
            refreshInterval: local.refetchInterval,
            upperCaseDescription: local.upperCaseDescription,
            paginationLimit: local.paginationLimit,
        });
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        toast.success('Configuración guardada');
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Configuraciones</h2>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Intervalo de Actualización (ms)
                    </label>
                    <input
                        type="number"
                        value={local.refetchInterval}
                        onChange={e => setLocal(l => ({ ...l, refetchInterval: parseInt(e.target.value) }))}
                        className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                        min="5000"
                        step="1000"
                        max="30000"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Entre 5 y 30 segundos
                    </p>
                </div>
                <div>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={local.upperCaseDescription}
                            onChange={e => setLocal(l => ({ ...l, upperCaseDescription: e.target.checked }))}
                            className="rounded text-blue-600"
                        />
                        <span className="text-sm font-medium text-gray-700">
                            Mostrar descripciones en mayúsculas
                        </span>
                    </label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Límite de Paginación
                    </label>
                    <input
                        type="number"
                        value={local.paginationLimit}
                        onChange={e => setLocal(l => ({ ...l, paginationLimit: parseInt(e.target.value) }))}
                        className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                        max="20"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Entre 1 y 20 items por página
                    </p>
                </div>
            </div>
            <button
                onClick={handleSave}
                className="mt-6 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700"
            >
                Guardar
            </button>
        </div>
    );
};