export interface NavCategory {
  id: string
  name: string
  image: string
}

export interface NavLinkItem {
  href: string
  label: string
  sectionId?: string
}
