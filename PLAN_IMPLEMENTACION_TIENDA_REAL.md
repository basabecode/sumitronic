# Plan de Implementación: Convertir la Página en Tienda Real

## 🚨 RIESGOS CRÍTICOS A RESOLVER INMEDIATAMENTE

### 1. **AUTENTICACIÓN Y AUTORIZACIÓN**

- **Riesgo**: Sin sistema de usuarios, cualquiera puede acceder a todo
- **Impacto**: Imposible tener clientes reales, órdenes o pagos seguros
- **Prioridad**: CRÍTICA

### 2. **BACKEND Y API SEGURA**

- **Riesgo**: Datos estáticos, sin persistencia real
- **Impacto**: No hay gestión real de inventario, órdenes o clientes
- **Prioridad**: CRÍTICA

### 3. **PASARELA DE PAGOS**

- **Riesgo**: Sin procesamiento de pagos real
- **Impacto**: Imposible completar transacciones reales
- **Prioridad**: CRÍTICA

### 4. **SEGURIDAD DE DATOS**

- **Riesgo**: Sin encriptación, validación o protección
- **Impacto**: Vulnerabilidades de seguridad graves
- **Prioridad**: CRÍTICA

---

## 📋 PLAN DE IMPLEMENTACIÓN EN 3 FASES

### **FASE 1: FUNDACIONES SEGURAS (Semana 1-2)**

#### 1.1 Configurar Variables de Entorno

```bash
# Crear archivo .env.local
touch .env.local
```

**Contenido del .env.local:**

```env
# Base de datos
DATABASE_URL="postgresql://usuario:password@localhost:5432/tienda_vergel"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-super-seguro-aqui"

# Proveedores OAuth
GOOGLE_CLIENT_ID="tu-google-client-id"
GOOGLE_CLIENT_SECRET="tu-google-client-secret"

# Stripe (pagos)
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (para notificaciones)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="tu-email@gmail.com"
EMAIL_SERVER_PASSWORD="tu-app-password"
EMAIL_FROM="noreply@tiendavergel.com"
```

#### 1.2 Instalar Dependencias de Seguridad

```bash
npm install next-auth
npm install @next-auth/prisma-adapter
npm install prisma @prisma/client
npm install stripe
npm install bcryptjs
npm install joi
npm install jsonwebtoken
npm install nodemailer
```

#### 1.3 Configurar Base de Datos con Prisma

**Instalar y configurar Prisma:**

```bash
npx prisma init
```

**Esquema de base de datos (prisma/schema.prisma):**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  role          Role      @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts Account[]
  sessions Session[]
  orders   Order[]
  cart     CartItem[]
  addresses Address[]
}

model Product {
  id           String     @id @default(cuid())
  name         String
  description  String
  price        Float
  originalPrice Float?
  category     String
  brand        String
  image        String
  badge        String?
  stock        Int        @default(0)
  isActive     Boolean    @default(true)
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  cartItems CartItem[]
  orderItems OrderItem[]
}

model CartItem {
  id        String @id @default(cuid())
  userId    String
  productId String
  quantity  Int    @default(1)

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([userId, productId])
}

model Order {
  id          String      @id @default(cuid())
  userId      String
  total       Float
  status      OrderStatus @default(PENDING)
  stripeId    String?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  user       User        @relation(fields: [userId], references: [id])
  items      OrderItem[]
  address    Address?    @relation(fields: [addressId], references: [id])
  addressId  String?
}

model OrderItem {
  id        String @id @default(cuid())
  orderId   String
  productId String
  quantity  Int
  price     Float

  order   Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id])
}

model Address {
  id       String @id @default(cuid())
  userId   String
  street   String
  city     String
  state    String
  zipCode  String
  country  String
  isDefault Boolean @default(false)

  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  orders Order[]
}

enum Role {
  USER
  ADMIN
}

enum OrderStatus {
  PENDING
  PAID
  SHIPPED
  DELIVERED
  CANCELLED
}
```

#### 1.4 Configurar NextAuth.js

**Crear app/api/auth/[...nextauth]/route.ts:**

```typescript
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.role = token.role
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }
```

### **FASE 2: FUNCIONALIDADES CORE (Semana 3-4)**

#### 2.1 Crear API Routes Seguras

**API para productos (app/api/products/route.ts):**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import Joi from 'joi'

const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().positive().required(),
  originalPrice: Joi.number().positive().optional(),
  category: Joi.string().required(),
  brand: Joi.string().required(),
  stock: Joi.number().integer().min(0).required(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const onSale = searchParams.get('onSale')

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(category && { category }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { brand: { contains: search, mode: 'insensitive' } },
          ],
        }),
        ...(onSale === 'true' && {
          OR: [{ badge: 'Oferta' }, { originalPrice: { gt: 0 } }],
        }),
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { error, value } = productSchema.validate(body)

    if (error) {
      return NextResponse.json(
        { error: error.details[0].message },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: value,
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    )
  }
}
```

#### 2.2 Implementar Carrito Persistente

**API del carrito (app/api/cart/route.ts):**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: { product: true },
    })

    return NextResponse.json(cartItems)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener carrito' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { productId, quantity } = await request.json()

    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        userId: session.user.id,
        productId,
        quantity,
      },
      include: { product: true },
    })

    return NextResponse.json(cartItem)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al agregar al carrito' },
      { status: 500 }
    )
  }
}
```

#### 2.3 Integrar Stripe para Pagos

**API de checkout (app/api/checkout/route.ts):**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { items, addressId } = await request.json()

    // Calcular total
    const total = items.reduce(
      (sum: number, item: any) => sum + item.product.price * item.quantity,
      0
    )

    // Crear orden en la base de datos
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total,
        addressId,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    })

    // Crear sesión de Stripe
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name,
            images: [item.product.image],
          },
          unit_amount: Math.round(item.product.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
      metadata: {
        orderId: order.id,
      },
    })

    return NextResponse.json({
      sessionId: stripeSession.id,
      orderId: order.id,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al procesar el checkout' },
      { status: 500 }
    )
  }
}
```

### **FASE 3: OPTIMIZACIÓN Y PRODUCCIÓN (Semana 5-6)**

#### 3.1 Configurar Webhook de Stripe

**Webhook para confirmar pagos (app/api/webhooks/stripe/route.ts):**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const orderId = session.metadata?.orderId

    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'PAID',
          stripeId: session.id,
        },
      })

      // Limpiar carrito del usuario
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { user: true },
      })

      if (order) {
        await prisma.cartItem.deleteMany({
          where: { userId: order.userId },
        })
      }
    }
  }

  return NextResponse.json({ received: true })
}
```

#### 3.2 Implementar Panel de Administración

**Página de admin (app/admin/products/page.tsx):**

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminProducts() {
  const { data: session } = useSession()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchProducts()
    }
  }, [session])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  if (session?.user?.role !== 'ADMIN') {
    return <div>No autorizado</div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Productos</h1>
        <Button>Agregar Producto</Button>
      </div>

      <div className="grid gap-4">
        {products.map((product: any) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Precio: ${product.price}</p>
              <p>Stock: {product.stock}</p>
              <p>Categoría: {product.category}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

## 🔧 COMANDOS DE IMPLEMENTACIÓN

### 1. Configuración Inicial

```bash
# 1. Instalar dependencias
npm install next-auth @next-auth/prisma-adapter prisma @prisma/client stripe bcryptjs joi jsonwebtoken nodemailer

# 2. Configurar Prisma
npx prisma init
npx prisma db push
npx prisma generate

# 3. Crear seed inicial
npx prisma db seed
```

### 2. Variables de Entorno Requeridas

```bash
# Crear .env.local con todas las variables mencionadas arriba
cp .env.example .env.local
# Editar .env.local con tus credenciales reales
```

### 3. Migración de Datos

```bash
# Migrar productos existentes a la base de datos
node scripts/migrate-products.js
```

### 4. Despliegue en Producción

```bash
# Construir para producción
npm run build

# Verificar que todo funciona
npm start
```

## ⚠️ CONSIDERACIONES DE SEGURIDAD CRÍTICAS

### 1. **Validación de Entrada**

- Todos los inputs deben ser validados con Joi
- Sanitización de datos antes de almacenar
- Protección contra SQL injection con Prisma

### 2. **Autenticación Robusta**

- Implementar rate limiting en login
- Verificación de email obligatoria
- Políticas de contraseñas fuertes

### 3. **Autorización Granular**

- Middleware de autenticación en todas las API routes
- Verificación de roles (USER, ADMIN)
- Protección de rutas sensibles

### 4. **Datos Sensibles**

- Nunca exponer claves API en el frontend
- Encriptar datos sensibles en la base de datos
- Logs seguros (sin contraseñas o tokens)

## 📈 MÉTRICAS DE ÉXITO

### Semana 1-2:

- ✅ Sistema de autenticación funcional
- ✅ Base de datos configurada
- ✅ Variables de entorno seguras

### Semana 3-4:

- ✅ API routes protegidas funcionando
- ✅ Carrito persistente
- ✅ Integración básica con Stripe

### Semana 5-6:

- ✅ Pagos funcionando completamente
- ✅ Panel de administración básico
- ✅ Webhooks de Stripe configurados
- ✅ Preparado para producción

## 🚀 PRÓXIMOS PASOS INMEDIATOS

1. **Revisar este documento** y priorizar qué implementar primero
2. **Configurar las variables de entorno** con credenciales reales
3. **Comenzar con NextAuth.js** como base de seguridad
4. **Configurar la base de datos** PostgreSQL
5. **Implementar las API routes** una por una
6. **Integrar Stripe** para pagos reales
7. **Testear exhaustivamente** antes de producción

¿Por dónde quieres comenzar? ¿NextAuth.js, la configuración de la base de datos, o prefieres que ajuste algún aspecto específico de este plan?
