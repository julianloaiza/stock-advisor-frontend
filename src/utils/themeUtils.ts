// Posibles valores para el tema
export type Theme = 'light' | 'dark'

// Obtiene el tema actual basado en localStorage o preferencias del sistema
export const getTheme = (): Theme => {
  if (typeof localStorage !== 'undefined') {
    const storedTheme = localStorage.getItem('theme') as Theme | null
    if (storedTheme) {
      return storedTheme
    }
  }
  // Si no hay tema en localStorage, usa preferencias del sistema
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  // Valor por defecto
  return 'light'
}

// Aplica el tema al documento HTML y guarda la preferencia en localStorage
export const applyTheme = (theme: Theme): void => {
  if (typeof document !== 'undefined') {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }
}

// Inicializa el tema al cargar la aplicación
export const initTheme = (): void => {
  const theme = getTheme()
  applyTheme(theme)
}
