import React, { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  onClose: () => void
}

export const Toast: React.FC<ToastProps> = ({
  type,
  title,
  message,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Esperar la animación antes de cerrar
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500',
          text: 'text-white',
          icon: <CheckCircle className="w-5 h-5" />
        }
      case 'error':
        return {
          bg: 'bg-red-500',
          text: 'text-white',
          icon: <XCircle className="w-5 h-5" />
        }
      case 'warning':
        return {
          bg: 'bg-yellow-500',
          text: 'text-white',
          icon: <AlertCircle className="w-5 h-5" />
        }
      case 'info':
        return {
          bg: 'bg-blue-500',
          text: 'text-white',
          icon: <AlertCircle className="w-5 h-5" />
        }
      default:
        return {
          bg: 'bg-gray-500',
          text: 'text-white',
          icon: <AlertCircle className="w-5 h-5" />
        }
    }
  }

  const styles = getStyles()

  return (
    <div
      className={`fixed top-4 right-4 ${styles.bg} ${styles.text} px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-3 transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      {styles.icon}
      <div className="flex-1 min-w-0">
        <div className="font-medium">{title}</div>
        {message && <div className="text-sm opacity-90">{message}</div>}
      </div>
      <button
        onClick={() => {
          setIsVisible(false)
          setTimeout(onClose, 300)
        }}
        className="text-white hover:text-gray-200 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

// Hook para usar toasts
export const useToast = () => {
  const [toasts, setToasts] = useState<Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message?: string
    duration?: number
  }>>([])

  const showToast = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message?: string,
    duration?: number
  ) => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, type, title, message, duration }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const success = (title: string, message?: string, duration?: number) => {
    showToast('success', title, message, duration)
  }

  const error = (title: string, message?: string, duration?: number) => {
    showToast('error', title, message, duration)
  }

  const warning = (title: string, message?: string, duration?: number) => {
    showToast('warning', title, message, duration)
  }

  const info = (title: string, message?: string, duration?: number) => {
    showToast('info', title, message, duration)
  }

  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
} 