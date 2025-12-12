# 🔍 Sistema de Testing de Base de Datos - CapiShop

Este documento describe el sistema completo de validación y testing de la integración entre Supabase y el frontend de CapiShop.

## 📋 Índice

1. [Descripción General](#descripción-general)
2. [Archivos del Sistema](#archivos-del-sistema)
3. [Configuración Previa](#configuración-previa)
4. [Métodos de Ejecución](#métodos-de-ejecución)
5. [Tests Incluidos](#tests-incluidos)
6. [Interpretación de Resultados](#interpretación-de-resultados)
7. [Solución de Problemas](#solución-de-problemas)

## 🎯 Descripción General

El sistema de testing valida la operabilidad completa entre:

- **Supabase (PostgreSQL)**: Base de datos principal
- **Frontend Next.js**: Aplicación web
- **APIs**: Endpoints de productos, categorías, etc.
- **TypeScript Types**: Compatibilidad de tipos
- **Performance**: Tiempos de respuesta y optimización

## 📁 Archivos del Sistema

### Scripts de Testing

```
scripts/
├── database-health-check.ts     # Test completo de salud de DB
├── migrate-json-to-supabase.ts  # Migración de datos JSON
└── migrate-products.ts          # Migración específica de productos
```

### Librerías de Testing

```
lib/
└── database-tester.ts           # Tester para integración frontend
```

### Interfaces Web

```
app/test/database/
└── page.tsx                     # Página web de testing
```

### Esquema de Base de Datos

```
supabase/
├── schema.sql                   # Esquema completo de Supabase
└── verification.sql             # Queries de verificación
```

## ⚙️ Configuración Previa

### 1. Variables de Entorno

Asegúrate de tener configuradas las siguientes variables en `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

### 2. Dependencias

```bash
npm install @supabase/supabase-js
```

### 3. Base de Datos

Ejecuta el esquema de Supabase:

```sql
-- Ejecutar scripts/schema.sql en tu panel de Supabase
```

## 🚀 Métodos de Ejecución

### 1. Comando de Terminal (Recomendado)

```bash
# Test completo de salud de base de datos
npm run test:database

# Migración de datos desde JSON
npm run migrate:json
```

### 2. Interfaz Web

```bash
# Iniciar servidor de desarrollo
npm run dev

# Visitar la página de testing
npm run open:test
# O manualmente: http://localhost:3004/test/database
```

### 3. Script Directo

```bash
# Con tsx (recomendado)
npx tsx scripts/database-health-check.ts

# Con ts-node
npx ts-node scripts/database-health-check.ts
```

## 🧪 Tests Incluidos

### 1. Tests de Conectividad

- ✅ Conexión básica con Supabase
- ✅ Autenticación y permisos
- ✅ Latencia de red

### 2. Tests de Estructura

- ✅ Existencia de tablas requeridas
- ✅ Estructura de columnas
- ✅ Índices y constraints
- ✅ Row Level Security (RLS)

### 3. Tests de Datos

- ✅ Presencia de datos de ejemplo
- ✅ Integridad referencial
- ✅ Consistencia de tipos
- ✅ Validación de constraints

### 4. Tests de Funcionalidad

- ✅ API de productos
- ✅ API de categorías
- ✅ Búsqueda de productos
- ✅ Filtros y ordenamiento
- ✅ Paginación

### 5. Tests de Performance

- ✅ Tiempo de consultas complejas
- ✅ Búsqueda full-text
- ✅ Joins entre tablas
- ✅ Optimización de índices

### 6. Tests de Integración Frontend

- ✅ Compatibilidad con tipos TypeScript
- ✅ Transformación de datos
- ✅ Manejo de errores
- ✅ Estados de carga

## 📊 Interpretación de Resultados

### Códigos de Estado

- 🟢 **PASS**: Test exitoso, todo funcionando correctamente
- 🟡 **WARNING**: Test pasó pero hay áreas de mejora
- 🔴 **FAIL**: Test falló, requiere atención inmediata

### Score de Salud

- **90-100%**: 🟢 Excelente - Listo para producción
- **70-89%**: 🟡 Bueno - Algunas optimizaciones recomendadas
- **<70%**: 🔴 Crítico - Requiere correcciones antes de producción

### Ejemplo de Output

```
🚀 INICIANDO HEALTH CHECK DE BASE DE DATOS CAPISHOP
============================================================

🔗 TESTING DATABASE CONNECTION...
✅ Database Connection: Conexión exitosa con Supabase

📋 TESTING TABLE STRUCTURE...
✅ Table Structure - users: Tabla 'users' existe y es accesible
✅ Table Structure - products: Tabla 'products' existe y es accesible
✅ Table Structure - categories: Tabla 'categories' existe y es accesible

📊 TESTING SAMPLE DATA...
✅ Sample Data - Categories: 6 categorías encontradas
✅ Sample Data - Products: 12 productos encontrados

🔗 TESTING TABLE RELATIONSHIPS...
✅ Relationships - Products-Categories: 10/12 productos tienen categoría

⚡ TESTING PERFORMANCE...
✅ Performance - Product Search: Búsqueda completada en 234ms

============================================================
📊 REPORTE FINAL DEL HEALTH CHECK
============================================================
⏱️  Tiempo total: 1250ms
✅ Pasaron: 15/16 tests
❌ Fallaron: 0/16 tests
⚠️  Advertencias: 1/16 tests

🟢 SCORE DE SALUD: 94%
============================================================
```

## 🔧 Solución de Problemas

### Error: "No se puede conectar a Supabase"

```bash
# Verificar variables de entorno
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Verificar conectividad
curl -I $NEXT_PUBLIC_SUPABASE_URL/rest/v1/
```

### Error: "Tabla no existe"

```sql
-- Ejecutar el esquema completo
\i supabase/schema.sql

-- Verificar tablas existentes
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';
```

### Error: "RLS policies"

```sql
-- Verificar políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';
```

### Error: "Datos faltantes"

```bash
# Ejecutar migración de datos
npm run migrate:json

# O manualmente
npx tsx scripts/migrate-json-to-supabase.ts
```

### Performance lento

```sql
-- Verificar índices
SELECT schemaname, tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public';

-- Analizar queries lentas
EXPLAIN ANALYZE SELECT * FROM products
JOIN categories ON products.category_id = categories.id;
```

## 📝 Logs y Debugging

### Habilitar logs detallados

```typescript
// En database-tester.ts, cambiar nivel de log
const DEBUG = true // Más información en consola
```

### Logs de Supabase

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(url, key, {
  auth: {
    debug: true, // Logs de autenticación
  },
  db: {
    schema: 'public',
  },
})
```

## 🚀 Automatización

### GitHub Actions

```yaml
# .github/workflows/database-test.yml
name: Database Health Check
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run test:database
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
```

### Cron Jobs

```bash
# Ejecutar tests diarios
0 6 * * * cd /path/to/project && npm run test:database
```

## 📞 Soporte

Si encuentras problemas:

1. **Revisa los logs**: Cada test proporciona información detallada de errores
2. **Verifica configuración**: Asegúrate de que Supabase esté correctamente configurado
3. **Consulta documentación**: [Supabase Docs](https://supabase.com/docs)
4. **Reporta issues**: Usa el sistema de issues del repositorio

---

**Última actualización**: 13 de septiembre de 2025
**Versión**: 1.0.0
**Compatibilidad**: Next.js 14.x, Supabase 2.x
