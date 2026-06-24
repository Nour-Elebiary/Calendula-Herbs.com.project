'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const MapEmbedInner = dynamic(
  () => import('@/components/public/MapEmbed').then(mod => mod.MapEmbed),
  {
    ssr: false,
    loading: () => <div className="w-full h-[400px] rounded-2xl bg-[var(--color-bg-base)] animate-pulse" />,
  }
)

interface MapEmbedWrapperProps {
  lat: number
  lng: number
  address: string
}

export function MapEmbedWrapper({ lat, lng, address }: MapEmbedWrapperProps) {
  return <MapEmbedInner lat={lat} lng={lng} address={address} />
}
