'use client'
import { useState } from 'react'
import { MessageCircle, Send, MessageSquare, Mail, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSiteSettings } from '@/entities/siteSettings/SiteSettingsStore'

export function ContactWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const toggleWidget = () => {
    setIsOpen(!isOpen)
  }
  const { siteSettings } = useSiteSettings()
  return (
    <div className="fixed flex flex-col bottom-20 right-6 md:bottom-12 md:right-12 z-50">
      {/* Expanded State */}
      {isOpen && (
        <div className="mb-4 bg-white rounded-2xl shadow-lg border border-gray-200 p-4 min-w-[200px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Связаться с нами</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleWidget}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {/* Telegram */}
            <a
              href={siteSettings?.socialLinks.telegram || ''}
              className="w-full cursor-pointer flex justify-start items-center h-10 px-3 hover:bg-blue-50 text-gray-700"
            >
              <Send className="h-4 w-4 mr-3 text-blue-500" />
              Telegram
            </a>

            {/* WhatsApp */}
            <a
              href={siteSettings?.socialLinks.whatsApp || ''}
              className="w-full flex cursor-pointer justify-start items-center h-10 px-3 hover:bg-green-50 text-gray-700"
            >
              <MessageSquare className="h-4 w-4 mr-3 text-green-500" />
              WhatsApp
            </a>

            {/* Email */}
            <a
              href={`mailto:${siteSettings?.socialLinks.email}`}
              className="w-full flex cursor-pointer justify-start items-center h-10 px-3 hover:bg-gray-50 text-gray-700"
            >
              <Mail className="h-4 w-4 mr-3 text-gray-500" />
              Email
            </a>
          </div>
        </div>
      )}

      {/* Main Toggle Button */}
      <Button
        onClick={toggleWidget}
        className="h-16 w-16 ml-auto rounded-full bg-slate-600 hover:bg-slate-700 shadow-lg transition-all duration-200 hover:scale-105"
      >
        <MessageCircle className="text-white min-w-[24px] min-h-[24px]" />
      </Button>
    </div>
  )
}
