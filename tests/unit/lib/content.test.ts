import { describe, expect, it } from 'vitest'
import {
  blogPosts,
  getBlogPostBySlug,
  getHelpArticleBySlug,
  helpArticles,
} from '@/lib/content'

describe('content collections', () => {
  it('exposes blog posts with unique slugs', () => {
    const slugs = blogPosts.map(post => post.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('resolves a blog post by slug', () => {
    expect(getBlogPostBySlug(blogPosts[0].slug)?.title).toBe(blogPosts[0].title)
  })

  it('exposes help articles with unique slugs', () => {
    const slugs = helpArticles.map(article => article.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('resolves a help article by slug', () => {
    expect(getHelpArticleBySlug(helpArticles[0].slug)?.title).toBe(helpArticles[0].title)
  })
})
