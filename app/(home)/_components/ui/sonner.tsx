"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "var(--ecommerce-emerald)",
          "--success-text": "#ffffff",
          "--error-bg": "var(--ecommerce-red)",
          "--error-text": "#ffffff",
          "--info-bg": "#3b82f6",
          "--info-text": "#ffffff",
          "--warning-bg": "var(--ecommerce-amber)",
          "--warning-text": "#000000",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
