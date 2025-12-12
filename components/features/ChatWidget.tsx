'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Datos de FAQ reutilizados de FAQSection
const chatFAQs = [
  {
    keywords: [
      'productos',
      'originales',
      'garantía',
      'oficial',
      'autenticidad',
      'marca',
    ],
    question: '¿Los productos son originales con garantía oficial?',
    answer:
      'Sí, todos nuestros productos son 100% originales con garantía oficial del fabricante. Somos distribuidores de la marca Dahua, Imou, Logitech, Forza y TP-Link, lo que garantiza autenticidad y respaldo técnico en Colombia.',
  },
  {
    keywords: ['entrega', 'envío', 'tiempo', 'demora', 'cuando', 'llega'],
    question: '¿Cuáles son los tiempos de entrega?',
    answer:
      'En Cali y principales ciudades de Colombia: 1-2 días hábiles. Ciudades intermedias: 2-5 días hábiles. Municipios y zonas rurales: 5-8 días hábiles. Trabajamos con Servientrega, Envía e Interrapidísimo.',
  },
  {
    keywords: [
      'pago',
      'métodos',
      'pagar',
      'efectivo',
      'tarjeta',
      'pse',
      'nequi',
      'daviplata',
    ],
    question: '¿Qué métodos de pago manejan?',
    answer:
      'Aceptamos: Efectivo contra entrega en Cali, transferencias bancarias, Nequi, Daviplata y consignaciones a traves de Bancolombia y Daviplata. En el momento no manejamos creditos ni sistema PSE o pago electronico.',
  },
  {
    keywords: [
      'cambio',
      'devolución',
      'devolver',
      'cambiar',
      'política',
      'garantía',
    ],
    question: '¿Cuál es la política de cambios y devoluciones?',
    answer:
      'Tienes 8 días calendario para cambios o devoluciones. Los productos deben estar en perfecto estado con empaques originales. Gastos de envío gratuitos si hay defectos de fábrica.',
  },
  {
    keywords: [
      'soporte',
      'técnico',
      'servicio',
      'instalación',
      'configuración',
      'ayuda',
    ],
    question: '¿Ofrecen servicio técnico especializado?',
    answer:
      'Ofrecemos soporte técnico gratuito por WhatsApp segun el tipo de producto que requiera, instalación a domicilio en la ciudad de Cali.',
  },
  {
    keywords: [
      'contacto',
      'teléfono',
      'whatsapp',
      'dirección',
      'horario',
      'ubicación',
    ],
    question: '¿Cómo puedo contactarlos?',
    answer:
      'Puedes contactarnos por WhatsApp (300 3094854), llamar (300 3094854), o email (info@capishop.com). Horarios: Lunes a Viernes 8AM-6PM, Sábados 9AM-2PM. También tenemos showroom en Bogotá.',
  },
]

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  showWhatsApp?: boolean
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: '¡Hola! 👋 Soy tu asistente virtual. Puedo ayudarte con información sobre productos, envíos, pagos y más. ¿En qué te puedo ayudar?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Cerrar chat con tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  const quickReplies = [
    'Métodos de pago',
    'Tiempos de entrega',
    'Garantía de productos',
    'Políticas de devolución',
  ]

  const followUpOptions = [
    'Ver más opciones',
    'Contactar por WhatsApp',
    'Salir del chat',
  ]

  const findAnswer = (
    userMessage: string
  ): { answer: string; found: boolean } => {
    const message = userMessage.toLowerCase()

    // Opciones especiales
    if (
      message.includes('salir') ||
      message.includes('cerrar') ||
      message.includes('terminar')
    ) {
      return {
        answer:
          '¡Gracias por contactarnos! Ha sido un placer ayudarte. Si necesitas algo más en el futuro, estaremos aquí. ¡Que tengas un excelente día! 😊',
        found: true,
      }
    }

    if (
      message.includes('más opciones') ||
      message.includes('ver más') ||
      message.includes('otras opciones')
    ) {
      return {
        answer:
          'Claro, aquí tienes más información que te puede interesar. Selecciona cualquiera de las opciones de abajo o escríbeme tu pregunta:',
        found: true,
      }
    }

    for (const faq of chatFAQs) {
      const hasKeyword = faq.keywords.some(keyword =>
        message.includes(keyword.toLowerCase())
      )

      if (hasKeyword) {
        return { answer: faq.answer, found: true }
      }
    }

    return {
      answer:
        'No encontré lo que buscas, pero puedes contactarnos directamente en WhatsApp para recibir ayuda personalizada de nuestro equipo.',
      found: false,
    }
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, newMessage])
    setInputMessage('')

    // Procesar respuesta del bot
    setTimeout(() => {
      const { answer, found } = findAnswer(inputMessage)

      const botResponse: Message = {
        id: messages.length + 2,
        text: answer,
        sender: 'bot',
        timestamp: new Date(),
        showWhatsApp: !found,
      }

      setMessages(prev => [...prev, botResponse])

      // Cerrar el chat si es un mensaje de despedida
      if (
        inputMessage.toLowerCase().includes('salir') ||
        inputMessage.toLowerCase().includes('cerrar') ||
        inputMessage.toLowerCase().includes('terminar')
      ) {
        setTimeout(() => {
          setIsOpen(false)
        }, 2000)
      }

      // Agregar pregunta de seguimiento después de la respuesta
      if (
        !inputMessage.toLowerCase().includes('salir') &&
        !inputMessage.toLowerCase().includes('cerrar')
      ) {
        setTimeout(() => {
          const followUpMessage: Message = {
            id: messages.length + 3,
            text: '¿Necesitas ayuda con algo más? 🤔',
            sender: 'bot',
            timestamp: new Date(),
          }
          setMessages(prev => [...prev, followUpMessage])
        }, 1500)
      }
    }, 800)
  }

  const handleQuickReply = (reply: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      text: reply,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, newMessage])

    // Manejar opciones especiales
    if (reply === 'Contactar por WhatsApp') {
      setTimeout(() => {
        const botResponse: Message = {
          id: messages.length + 2,
          text: 'Perfecto, te redirigiremos a WhatsApp donde nuestro equipo te atenderá personalmente. ¡Será un gusto ayudarte! 📱',
          sender: 'bot',
          timestamp: new Date(),
          showWhatsApp: true,
        }
        setMessages(prev => [...prev, botResponse])
      }, 800)
      return
    }

    if (reply === 'Salir del chat') {
      setTimeout(() => {
        const botResponse: Message = {
          id: messages.length + 2,
          text: '¡Gracias por contactarnos! Ha sido un placer ayudarte. Si necesitas algo más en el futuro, estaremos aquí. ¡Que tengas un excelente día! 😊',
          sender: 'bot',
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, botResponse])

        // Cerrar el chat después de mostrar el mensaje de despedida
        setTimeout(() => {
          setIsOpen(false)
        }, 2000)
      }, 800)
      return
    }

    setTimeout(() => {
      const { answer } = findAnswer(reply)

      const botResponse: Message = {
        id: messages.length + 2,
        text: answer,
        sender: 'bot',
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, botResponse])

      // Agregar pregunta de seguimiento
      setTimeout(() => {
        const followUpMessage: Message = {
          id: messages.length + 3,
          text: '¿Necesitas ayuda con algo más? 🤔',
          sender: 'bot',
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, followUpMessage])
      }, 1500)
    }, 800)
  }

  const openWhatsApp = () => {
    window.open('https://wa.me/573003094854', '_blank')
  }

  // Cerrar chat al hacer clic fuera del modal
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-orange-600 hover:bg-orange-700 shadow-lg z-50 transition-all duration-300 hover:scale-110 ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
        aria-label="Abrir chat de ayuda"
      >
        <MessageCircle className="w-6 h-6 text-white" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 transition-opacity duration-300"
          onClick={handleOverlayClick}
        />
      )}

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl z-50 flex flex-col transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="bg-orange-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Asistente Virtual</h3>
              <p className="text-xs text-orange-100">En línea</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-orange-700 p-1"
            aria-label="Cerrar chat"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                  message.sender === 'user'
                    ? 'bg-orange-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
              >
                {message.text}

                {/* WhatsApp Button para fallback */}
                {message.showWhatsApp && (
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <Button
                      onClick={openWhatsApp}
                      className="w-full bg-green-600 hover:bg-green-700 text-white text-xs py-2"
                      size="sm"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Contactar por WhatsApp
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Quick Replies */}
          {messages.length === 1 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 text-center">
                Temas frecuentes:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="text-left px-2 py-2 text-xs bg-gray-50 hover:bg-orange-50 hover:text-orange-700 rounded-lg transition-colors border border-gray-200 hover:border-orange-200"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Follow-up Options - mostrar después de cada respuesta del bot */}
          {messages.length > 1 &&
            messages[messages.length - 1].sender === 'bot' &&
            messages[messages.length - 1].text.includes(
              '¿Necesitas ayuda con algo más?'
            ) && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 text-center">
                  Opciones disponibles:
                </p>
                <div className="space-y-1">
                  {quickReplies.map((reply, index) => (
                    <button
                      key={`quick-${index}`}
                      onClick={() => handleQuickReply(reply)}
                      className="w-full text-left px-2 py-2 text-xs bg-gray-50 hover:bg-orange-50 hover:text-orange-700 rounded-lg transition-colors border border-gray-200 hover:border-orange-200"
                    >
                      {reply}
                    </button>
                  ))}
                  <div className="grid grid-cols-2 gap-1 mt-2">
                    {followUpOptions.map((option, index) => (
                      <button
                        key={`follow-${index}`}
                        onClick={() => handleQuickReply(option)}
                        className={`text-center px-2 py-2 text-xs rounded-lg transition-colors border ${
                          option === 'Contactar por WhatsApp'
                            ? 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200 hover:border-green-300'
                            : option === 'Salir del chat'
                            ? 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200 hover:border-red-300'
                            : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 hover:border-blue-300'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="flex-1 text-sm"
              onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
              disabled={false}
            />
            <Button
              onClick={handleSendMessage}
              size="sm"
              className="bg-orange-600 hover:bg-orange-700"
              disabled={!inputMessage.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
