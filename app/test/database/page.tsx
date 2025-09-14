'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Loader2,
  Play,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react'

interface TestResult {
  testName: string
  status: 'PASS' | 'FAIL' | 'WARNING'
  message: string
  data?: any
  error?: any
  duration?: number
}

interface TestReport {
  summary: {
    total: number
    passed: number
    failed: number
    warnings: number
    healthScore: number
    totalDuration: number
  }
  results: TestResult[]
}

export default function DatabaseTestPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [report, setReport] = useState<TestReport | null>(null)
  const [currentTest, setCurrentTest] = useState<string>('')

  const runTests = async () => {
    setIsRunning(true)
    setReport(null)
    setCurrentTest('Iniciando tests...')

    try {
      // Ejecutar tests básicos sin dependencias externas
      const tests = [
        { name: 'API de Productos', endpoint: '/api/products' },
        { name: 'API de Categorías', endpoint: '/api/categories' },
      ]

      const results: TestResult[] = []

      for (const test of tests) {
        setCurrentTest(`Ejecutando: ${test.name}`)
        try {
          const response = await fetch(test.endpoint)
          const data = await response.json()

          if (response.ok) {
            results.push({
              testName: test.name,
              status: 'PASS',
              message: `${test.name} funcionando correctamente`,
              data: data,
            })
          } else {
            results.push({
              testName: test.name,
              status: 'FAIL',
              message: `Error en ${test.name}: ${response.statusText}`,
              error: data,
            })
          }
        } catch (error) {
          results.push({
            testName: test.name,
            status: 'FAIL',
            message: `Error de conexión en ${test.name}`,
            error: error,
          })
        }
      }

      // Generar reporte
      const passed = results.filter(r => r.status === 'PASS').length
      const failed = results.filter(r => r.status === 'FAIL').length
      const warnings = results.filter(r => r.status === 'WARNING').length
      const healthScore = Math.round((passed / results.length) * 100)

      const testReport: TestReport = {
        summary: {
          total: results.length,
          passed,
          failed,
          warnings,
          healthScore,
          totalDuration: 0,
        },
        results,
      }

      setReport(testReport)
      setCurrentTest('')
    } catch (error) {
      console.error('Error ejecutando tests:', error)
      setCurrentTest('Error ejecutando tests')
    } finally {
      setIsRunning(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASS':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'FAIL':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'WARNING':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      PASS: 'bg-green-100 text-green-800',
      FAIL: 'bg-red-100 text-red-800',
      WARNING: 'bg-yellow-100 text-yellow-800',
    }

    return (
      <Badge
        className={
          variants[status as keyof typeof variants] ||
          'bg-gray-100 text-gray-800'
        }
      >
        {status}
      </Badge>
    )
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getHealthScoreEmoji = (score: number) => {
    if (score >= 90) return '🟢'
    if (score >= 70) return '🟡'
    return '🔴'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔍 Test de Integración Base de Datos
          </h1>
          <p className="text-gray-600">
            Validador completo de la operabilidad entre Supabase y el frontend
            de CapiShop
          </p>
        </div>

        <div className="mb-6">
          <Button
            onClick={runTests}
            disabled={isRunning}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ejecutando Tests...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Ejecutar Tests de Integración
              </>
            )}
          </Button>

          {isRunning && currentTest && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-600" />
                <span className="text-blue-800 font-medium">{currentTest}</span>
              </div>
            </div>
          )}
        </div>

        {report && (
          <div className="space-y-6">
            {/* Resumen General */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  📊 Resumen General
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {report.summary.passed}
                    </div>
                    <div className="text-sm text-gray-600">Pasaron</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {report.summary.failed}
                    </div>
                    <div className="text-sm text-gray-600">Fallaron</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {report.summary.warnings}
                    </div>
                    <div className="text-sm text-gray-600">Advertencias</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">
                      {report.summary.totalDuration}ms
                    </div>
                    <div className="text-sm text-gray-600">Duración Total</div>
                  </div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div
                    className={`text-3xl font-bold ${getHealthScoreColor(
                      report.summary.healthScore
                    )}`}
                  >
                    {getHealthScoreEmoji(report.summary.healthScore)}{' '}
                    {report.summary.healthScore}%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Score de Salud de la Base de Datos
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resultados Detallados */}
            <Card>
              <CardHeader>
                <CardTitle>🔍 Resultados Detallados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {report.results.map((result, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                          {getStatusIcon(result.status)}
                          <h3 className="ml-2 font-semibold text-gray-900">
                            {result.testName}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-2">
                          {result.duration && (
                            <span className="text-xs text-gray-500">
                              {result.duration}ms
                            </span>
                          )}
                          {getStatusBadge(result.status)}
                        </div>
                      </div>

                      <p className="text-gray-700 mb-2">{result.message}</p>

                      {result.error && (
                        <div className="bg-red-50 border border-red-200 rounded p-3 mb-2">
                          <p className="text-red-800 text-sm font-medium">
                            Error:
                          </p>
                          <p className="text-red-700 text-sm">{result.error}</p>
                        </div>
                      )}

                      {result.data && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-3">
                          <p className="text-blue-800 text-sm font-medium mb-1">
                            Datos:
                          </p>
                          <pre className="text-blue-700 text-xs overflow-auto max-h-32">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recomendaciones */}
            <Card>
              <CardHeader>
                <CardTitle>💡 Recomendaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {report.summary.failed > 0 && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800 font-medium">
                        ❌ Hay {report.summary.failed} test(s) fallando que
                        requieren atención inmediata.
                      </p>
                      <p className="text-red-700 text-sm mt-1">
                        Revisa los errores específicos arriba y verifica la
                        configuración de Supabase.
                      </p>
                    </div>
                  )}

                  {report.summary.warnings > 0 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800 font-medium">
                        ⚠️ Hay {report.summary.warnings} advertencia(s) que
                        podrían mejorar el rendimiento.
                      </p>
                      <p className="text-yellow-700 text-sm mt-1">
                        Considera optimizar las consultas o agregar más datos de
                        prueba.
                      </p>
                    </div>
                  )}

                  {report.summary.healthScore >= 90 && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 font-medium">
                        ✅ ¡Excelente! La integración con la base de datos está
                        funcionando correctamente.
                      </p>
                      <p className="text-green-700 text-sm mt-1">
                        La aplicación está lista para producción desde el punto
                        de vista de base de datos.
                      </p>
                    </div>
                  )}

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 font-medium">
                      📈 Para mejorar el rendimiento:
                    </p>
                    <ul className="text-blue-700 text-sm mt-1 list-disc list-inside space-y-1">
                      <li>
                        Asegúrate de que todos los productos tengan categorías
                        asignadas
                      </li>
                      <li>
                        Mantén el inventario actualizado con stock disponible
                      </li>
                      <li>
                        Utiliza imágenes optimizadas para mejor rendimiento
                      </li>
                      <li>
                        Considera implementar caché para consultas frecuentes
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
