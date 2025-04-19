"use client"

import React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalWrapperProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  contentClassName?: string
  showCloseButton?: boolean
  preventBackdropClose?: boolean
}

export function ModalWrapper({
  isOpen,
  onClose,
  title,
  children,
  className,
  contentClassName,
  showCloseButton = true,
  preventBackdropClose = false,
}: ModalWrapperProps) {
  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !preventBackdropClose) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] overflow-y-auto p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className={cn(
          "bg-white rounded-xl border border-gray-200 shadow-lg max-h-[90vh] overflow-y-auto",
          "w-full max-w-md",
          "relative",
          className
        )}
        onClick={e => e.stopPropagation()}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        
        {title && (
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-medium text-gray-900">{title}</h2>
          </div>
        )}
        
        <div className={cn("p-6", contentClassName)}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default ModalWrapper
