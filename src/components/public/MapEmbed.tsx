'use client'

import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

type Props = {
  lat: number
  lng: number
  address: string
}

export function MapEmbed({ lat, lng, address }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || instanceRef.current) return
    const map = L.map(mapRef.current).setView([lat, lng], 14)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map)
    L.marker([lat, lng]).addTo(map).bindPopup(address)
    instanceRef.current = map
  }, [lat, lng, address])

  return <div ref={mapRef} className="w-full h-[400px] rounded-2xl border overflow-hidden z-0" />
}
