export default function TestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>✅ CAPISHOP - SERVIDOR FUNCIONANDO</h1>
      <p>🎉 ¡El servidor está corriendo correctamente!</p>
      <ul>
        <li>Puerto: 3003</li>
        <li>Tiempo: {new Date().toLocaleString()}</li>
        <li>Estado: Activo</li>
      </ul>
      <hr />
      <h2>🔗 Enlaces de prueba:</h2>
      <ul>
        <li>
          <a href="/auth/login">🔐 Login</a>
        </li>
        <li>
          <a href="/auth/register">📝 Registro</a>
        </li>
        <li>
          <a href="/admin">👑 Admin</a>
        </li>
        <li>
          <a href="/products">🛍️ Productos</a>
        </li>
      </ul>
    </div>
  )
}
