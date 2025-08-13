"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Исправление иконок (обязательно для Webpack/Vite)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

// Убираем стандартные пути и задаём свои
const DefaultIcon = L.Icon.Default as any
delete DefaultIcon.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
})

// Кастомный маркер в стиле Яндекс.Карт
const createCustomIcon = () => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: 30px;
        height: 30px;
        background: #ff4444;
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  })
}

interface LeafletMapProps {
  onMapClick: (coords: { lat: number; lng: number }) => void
  initialCoords?: { lat: number; lng: number }
  className?: string
}

const LeafletMap = ({ onMapClick, initialCoords, className }: LeafletMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const isInitializedRef = useRef(false)

  useEffect(() => {
    // Проверяем, что мы на клиенте
    if (typeof window === "undefined" || !mapRef.current || isInitializedRef.current) return

    // Координаты Ставропольского края (центр - Ставрополь)
    const stavropol = [45.0428, 41.9734]

    // Создаём карту только один раз
    const map = L.map(mapRef.current, {
      center: initialCoords ? [initialCoords.lat, initialCoords.lng] : stavropol,
      zoom: initialCoords ? 15 : 10,
      zoomControl: false,
    })

    // Добавляем контрол зума (в правый верхний угол)
    L.control.zoom({ position: "topright" }).addTo(map)

    // Тайлы OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    // Кастомные стили (вставляем в head только если их еще нет)
    if (!document.getElementById("leaflet-custom-styles")) {
      const style = document.createElement("style")
      style.id = "leaflet-custom-styles"
      style.textContent = `
        .leaflet-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #f0f0f0;
          width: 100% !important;
          height: 100% !important;
        }
        
        .leaflet-control-zoom {
          position: absolute !important;
          top: 70px !important;
          right: 10px !important;
          z-index: 1000 !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
        }
        
        .leaflet-control-zoom a {
          background: white !important;
          color: #333 !important;
          border: none !important;
          font-size: 18px !important;
          font-weight: bold !important;
          width: 40px !important;
          height: 40px !important;
          line-height: 40px !important;
          border-radius: 6px !important;
          margin: 2px !important;
          transition: all 0.2s ease !important;
        }
        
        .leaflet-control-zoom a:hover {
          background: #f5f5f5 !important;
          transform: scale(1.05);
        }
        
        .leaflet-control-zoom-in {
          border-radius: 6px 6px 0 0 !important;
        }
        
        .leaflet-control-zoom-out {
          border-radius: 0 0 6px 6px !important;
        }
        
        .custom-marker {
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
          z-index: 999 !important;
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 8px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        }
        
        .leaflet-popup-tip {
          box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
        }
        
        /* Фиксируем позицию attribution */
        .leaflet-control-attribution {
          position: absolute !important;
          bottom: 0 !important;
          right: 0 !important;
          z-index: 1000 !important;
          background: rgba(255, 255, 255, 0.8) !important;
          padding: 2px 5px !important;
          font-size: 10px !important;
          line-height: 1.2 !important;
          border-radius: 3px 0 0 0 !important;
        }
        
        .leaflet-control-attribution a {
          color: #0078A8 !important;
          text-decoration: none !important;
        }
        
        /* Убираем возможные конфликты */
        .leaflet-pane,
        .leaflet-tile,
        .leaflet-marker-icon,
        .leaflet-marker-shadow,
        .leaflet-tile-container,
        .leaflet-pane > svg,
        .leaflet-pane > canvas,
        .leaflet-zoom-box,
        .leaflet-image-layer,
        .leaflet-layer {
          position: absolute !important;
        }
        
        .leaflet-control-container {
          position: relative !important;
        }
        
        /* Убеждаемся что карта занимает всю доступную область */
        .leaflet-map-pane {
          position: relative !important;
        }
      `
      document.head.appendChild(style)
    }

    // Создаём маркер
    const marker = L.marker(initialCoords ? [initialCoords.lat, initialCoords.lng] : stavropol, {
      icon: createCustomIcon(),
      draggable: true,
    }).addTo(map)

    // Обработчик клика по карте
    const onClick = (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng
      // Перемещаем маркер БЕЗ изменения центра карты
      marker.setLatLng([lat, lng])
      onMapClick({ lat, lng })
    }

    // Обработчик перетаскивания
    const onDragEnd = () => {
      const { lat, lng } = marker.getLatLng()
      onMapClick({ lat, lng })
    }

    map.on("click", onClick)
    marker.on("dragend", onDragEnd)

    // Слушатель для обновления позиции (например, из поиска)
    const handleUpdateLocation = (event: CustomEvent) => {
      const { coords } = event.detail
      // Только при поиске перемещаем центр карты
      map.setView([coords.lat, coords.lng], 15)
      marker.setLatLng([coords.lat, coords.lng])
    }

    if (typeof window !== "undefined") {
      window.addEventListener("updateMapLocation", handleUpdateLocation as EventListener)
    }

    // Сохраняем ссылки
    mapInstanceRef.current = map
    markerRef.current = marker
    isInitializedRef.current = true

    // Принудительно обновляем размер карты после небольшой задержки
    setTimeout(() => {
      map.invalidateSize()
    }, 100)

    // Очистка
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("updateMapLocation", handleUpdateLocation as EventListener)
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
      isInitializedRef.current = false
    }
  }, []) // Убираем зависимости, чтобы карта создавалась только один раз

  // Отдельный эффект для обновления позиции маркера при изменении initialCoords
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current && initialCoords) {
      markerRef.current.setLatLng([initialCoords.lat, initialCoords.lng])
      mapInstanceRef.current.setView([initialCoords.lat, initialCoords.lng], 15)
    }
  }, [initialCoords])

  return <div ref={mapRef} className={`${className || ""}`} style={{ width: "100%", height: "100%" }} />
}

export default LeafletMap
