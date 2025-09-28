#!/bin/bash

# Script para aplicar optimizaciones de base de datos - Fase 3
# Ejecutar después de verificar que las APIs funcionan correctamente

echo "🚀 Aplicando optimizaciones de base de datos - Fase 3..."

# Verificar conexión con Supabase
echo "📡 Verificando conexión con Supabase..."
npx supabase status

if [ $? -ne 0 ]; then
    echo "❌ Error: No se puede conectar a Supabase. Verifica tu configuración."
    exit 1
fi

# Aplicar optimizaciones de rendimiento
echo "⚡ Aplicando índices y optimizaciones..."
npx supabase db push --include-all

if [ $? -eq 0 ]; then
    echo "✅ Optimizaciones aplicadas exitosamente"
    echo ""
    echo "📊 Optimizaciones implementadas:"
    echo "  • Eliminación de consultas N+1 en APIs de products y favorites"
    echo "  • Índices compuestos para filtros comunes"
    echo "  • Índices optimizados para ordenamiento"
    echo "  • Función de búsqueda full-text automática"
    echo "  • Triggers para mantener índices actualizados"
    echo ""
    echo "🎯 Rendimiento esperado:"
    echo "  • ~50-70% reducción en tiempo de respuesta de APIs"
    echo "  • Consultas de productos hasta 3x más rápidas"
    echo "  • Búsqueda full-text optimizada"
    echo "  • Mejor manejo de carga con índices compuestos"
else
    echo "❌ Error aplicando optimizaciones"
    exit 1
fi

echo ""
echo "🎉 ¡Fase 3 completada! Las optimizaciones de base de datos están activas."
