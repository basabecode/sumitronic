# Configuración de MCP (Model Context Protocol)

Esta carpeta contiene las configuraciones necesarias para conectar Antigravity (o tu cliente MCP preferido, como Claude Desktop) con servicios externos.

## 1. Supabase

Para vincular Supabase, necesitas agregar la siguiente configuración a tu archivo de configuración de MCP (por ejemplo, `claude_desktop_config.json` en `%APPDATA%\Claude\` o la configuración de tu extensión de VS Code).

Puedes copiar el contenido de `supabase-config.json` y reemplazar los valores con tus credenciales de `.env.local`.

### Credenciales necesarias:

- `SUPABASE_URL`: Tu URL del proyecto (ej. `https://xyz.supabase.co`)
- `SUPABASE_KEY`: Tu clave `anon` pública (o `service_role` si necesitas permisos de administración total, pero ten cuidado).

## 2. Netlify

Para vincular Netlify, usa la configuración de `netlify-config.json`.

### Credenciales necesarias:

- `NETLIFY_AUTH_TOKEN`: Tu token de acceso personal (Personal Access Token) de Netlify. Lo puedes generar en "User Settings" > "Applications" > "New access token".
- `NETLIFY_SITE_ID`: (Opcional) El API ID de tu sitio específico si quieres limitar el contexto.

## 3. Cómo activar los cambios

1. Copia los bloques `mcpServers` de los archivos JSON a tu configuración global de MCP.
2. **Reinicia** tu entorno (VS Code, Claude Desktop, o el agente que estés usando) para que reconozca los nuevos servidores.
3. Una vez reiniciado, el agente podrá ver y utilizar las herramientas de Supabase y Netlify.
