// Declaraciones globales de tipos para resolver conflictos del Language Server

declare module '@/components/ui/button' {
  import { VariantProps } from 'class-variance-authority'
  import * as React from 'react'

  export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
      VariantProps<any> {
    asChild?: boolean
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
  }

  export const Button: React.ForwardRefExoticComponent<
    ButtonProps & React.RefAttributes<HTMLButtonElement>
  >
}

declare module '@/components/ui/badge' {
  import { VariantProps } from 'class-variance-authority'
  import * as React from 'react'

  export interface BadgeProps 
    extends React.HTMLAttributes<HTMLDivElement>, 
      VariantProps<any> {
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  }

  export function Badge(props: BadgeProps): React.ReactElement
}