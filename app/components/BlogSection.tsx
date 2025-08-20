'use client'

import { useState } from 'react'
import { Calendar, User, ArrowRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import blogPostsData from '../../lib/blogPosts.json'

export default function BlogSection() {
  const blogPosts = blogPostsData
  const [selectedPost, setSelectedPost] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = (post: any) => {
    setSelectedPost(post)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedPost(null)
  }

  const scrollToProducts = () => {
    closeModal()
    const productsSection = document.getElementById('productos')
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="blog" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Blog y Novedades
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Mantente al día con las últimas tendencias tecnológicas, reviews y
            guías de compra
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.map(post => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group overflow-hidden"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-48 bg-gray-50">
                <img
                  src={post.image || '/placeholder.svg'}
                  alt={post.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3
                  className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2 cursor-pointer"
                  onClick={() => openModal(post)}
                >
                  {post.title}
                </h3>

                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <span className="text-orange-600 font-medium text-xs">
                    {post.readTime}
                  </span>
                </div>

                {/* Read More */}
                <Button
                  variant="ghost"
                  className="w-full justify-between text-orange-600 hover:text-orange-700 hover:bg-orange-50 p-0 h-auto font-medium text-sm"
                  onClick={() => openModal(post)}
                >
                  Leer Más
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Suscríbete a Nuestro Newsletter
          </h3>
          <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
            Recibe las últimas novedades, ofertas exclusivas y guías de compra
            directamente en tu email
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu email aquí..."
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <Button className="bg-white text-orange-600 hover:bg-gray-100 px-6 py-3 font-semibold">
              Suscribirse
            </Button>
          </div>

          <p className="text-xs text-orange-200 mt-4">
            No spam. Puedes cancelar tu suscripción en cualquier momento.
          </p>
        </div>

        {/* View All Posts */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8 bg-transparent">
            Ver Todos los Artículos
          </Button>
        </div>

        {/* Blog Post Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="text-3xl font-extrabold text-gray-900 pr-8 leading-tight">
                {selectedPost?.title}
              </DialogTitle>
            </DialogHeader>

            {selectedPost && (
              <div className="overflow-y-auto flex-1 mt-6 pr-2">
                {/* Post Image */}
                <div className="relative overflow-hidden rounded-lg mb-6 h-64 bg-gray-50">
                  <img
                    src={selectedPost.image || '/placeholder.svg'}
                    alt={selectedPost.title}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {selectedPost.category}
                    </span>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{selectedPost.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{selectedPost.date}</span>
                    </div>
                  </div>
                  <span className="text-orange-600 font-medium">
                    {selectedPost.readTime}
                  </span>
                </div>

                {/* Post Content */}
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {selectedPost.excerpt}
                  </p>

                  {/* Content simulado - en un caso real vendría del JSON o API */}
                  <div className="text-gray-700 space-y-4">
                    <p>
                      En el mundo de la tecnología, mantenerse actualizado es
                      fundamental para tomar las mejores decisiones de compra.
                      Este artículo profundiza en los aspectos más importantes
                      que debes considerar.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                      Puntos Clave a Considerar
                    </h3>

                    <ul className="list-disc list-inside space-y-2">
                      <li>
                        Análisis detallado de las especificaciones técnicas
                      </li>
                      <li>Comparativa con productos similares en el mercado</li>
                      <li>Relación calidad-precio y valor a largo plazo</li>
                      <li>Experiencia de usuario y casos de uso reales</li>
                    </ul>

                    <p>
                      Para obtener la mejor experiencia, recomendamos evaluar
                      cuidadosamente cada aspecto antes de tomar una decisión de
                      compra. Nuestro equipo de expertos está aquí para
                      ayudarte.
                    </p>

                    {/* Contenido adicional para demostrar el scroll */}
                    <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                      Recomendaciones Adicionales
                    </h3>

                    <p>
                      El mercado tecnológico está en constante evolución, y es
                      importante mantenerse informado sobre las últimas
                      tendencias y desarrollos. Nuestro equipo de expertos
                      analiza continuamente los productos para ofrecerte las
                      mejores recomendaciones.
                    </p>

                    <p>
                      No dudes en contactarnos si tienes alguna pregunta
                      específica sobre cualquier producto. Estamos aquí para
                      ayudarte a tomar la mejor decisión de compra.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 sticky bottom-0 bg-white">
                  <Button variant="outline" onClick={closeModal}>
                    Cerrar
                  </Button>
                  <Button
                    className="bg-orange-600 hover:bg-orange-700"
                    onClick={scrollToProducts}
                  >
                    Ver Productos Relacionados
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
