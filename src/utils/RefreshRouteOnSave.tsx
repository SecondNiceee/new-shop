'use client'
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import React from 'react'


export const RefreshRouteOnSave = ({route} : {route?:string}) => {
  const router = useRouter()
  const url = route ? process.env.NEXT_PUBLIC_URL + route : String(process.env.NEXT_PUBLIC_URL)
  return (
    <PayloadLivePreview
      refresh={() => router.refresh()}
      serverURL={url}
    />
  )
}