import type { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import Map from '../components/Map'

const MapView: NextPage = () => {
  const [mounted, setMounted] = useState(false)

  const MapComponent = Map as any;

  useEffect(() => {
    setMounted(true)
    return () => {
      setMounted(false)
    }
  }, [])
  return (
    <Layout title="Map View">
      <MapComponent/>
    </Layout>
  )
}

export default MapView