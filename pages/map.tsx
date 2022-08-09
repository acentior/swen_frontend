import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import Map from '../components/Map'

const MapView = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => {
      setMounted(false)
    }
  }, [])
  return (
    <Layout title="Map View">
      <Map/>
    </Layout>
  )
}

export default MapView