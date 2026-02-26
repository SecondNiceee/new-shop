"use client"

import React, { useEffect, useState } from "react"
import type { BeforeListClientProps } from "payload"

const SECTIONS = [
  { label: "Все", value: "" },
  { label: "Обучение", value: "education" },
  { label: "Массаж", value: "massage" },
  { label: "Косметология", value: "cosmetology" },
  { label: "Спа", value: "spa" },
  { label: "Тату", value: "tatu" },
  { label: "Подарочные сертификаты", value: "gift_certificates" },
]

const SECTION_STYLES: Record<string, { activeBg: string; activeBorder: string; activeText: string; icon: string }> = {
  "": {
    activeBg: "#f1f5f9",
    activeBorder: "#64748b",
    activeText: "#1e293b",
    icon: "📋",
  },
  education: {
    activeBg: "#fffbeb",
    activeBorder: "#d97706",
    activeText: "#92400e",
    icon: "🎓",
  },
  massage: {
    activeBg: "#f0fdf4",
    activeBorder: "#16a34a",
    activeText: "#14532d",
    icon: "💆",
  },
  cosmetology: {
    activeBg: "#fdf4ff",
    activeBorder: "#a855f7",
    activeText: "#581c87",
    icon: "✨",
  },
  spa: {
    activeBg: "#eff6ff",
    activeBorder: "#2563eb",
    activeText: "#1e3a8a",
    icon: "🌿",
  },
  tatu: {
    activeBg: "#f9fafb",
    activeBorder: "#374151",
    activeText: "#111827",
    icon: "🖋",
  },
  gift_certificates: {
    activeBg: "#fff7ed",
    activeBorder: "#ea580c",
    activeText: "#7c2d12",
    icon: "🎁",
  },
}

export const ProductsSectionFilter: React.FC<BeforeListClientProps> = () => {
  const [activeSection, setActiveSection] = useState<string>("")

  // Читаем текущий фильтр из URL при монтировании
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const current = params.get("where[section][equals]") || ""
    setActiveSection(current)
  }, [])

  const handleSelect = (value: string) => {
    setActiveSection(value)

    const params = new URLSearchParams(window.location.search)

    // Сбрасываем предыдущий фильтр по разделу
    params.delete("where[section][equals]")

    if (value !== "") {
      params.set("where[section][equals]", value)
    }

    // Сбрасываем страницу при смене фильтра
    params.delete("page")

    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.pushState({}, "", newUrl)

    // Триггерим событие чтобы Payload подхватил изменение URL
    window.dispatchEvent(new PopStateEvent("popstate"))
  }

  return (
    <div
      style={{
        padding: "16px 0 8px 0",
        marginBottom: "4px",
      }}
    >
      <p
        style={{
          fontSize: "11px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "#94a3b8",
          margin: "0 0 10px 0",
        }}
      >
        Фильтр по разделу
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        {SECTIONS.map((section) => {
          const isActive = activeSection === section.value
          const styles = SECTION_STYLES[section.value]

          return (
            <button
              key={section.value}
              onClick={() => handleSelect(section.value)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "8px",
                border: `2px solid ${isActive ? styles.activeBorder : "#e2e8f0"}`,
                background: isActive ? styles.activeBg : "#ffffff",
                color: isActive ? styles.activeText : "#64748b",
                fontWeight: isActive ? 600 : 400,
                fontSize: "13px",
                cursor: "pointer",
                transition: "all 0.15s ease",
                boxShadow: isActive
                  ? `0 0 0 3px ${styles.activeBorder}26`
                  : "0 1px 2px rgba(0,0,0,0.05)",
                outline: "none",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontSize: "15px" }}>{styles.icon}</span>
              <span>{section.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
