import { useEffect, useState } from 'react'
import Map from '../components/Map'

import citiesJSON from '../data/cities.json'
import { LIMIT_PAGE_OFFERS } from '../consts'

const GEOAPIFY_API = import.meta.env.VITE_GEOAPIFY_API

export default function Province ({ params }) {
  const { title, province } = params

  const queryString = window.location.search
  const sp = new URLSearchParams(queryString)

  const [loading, setLoading] = useState(false)

  const [offers, setOffers] = useState([])

  const [center, setCenter] = useState({ lat: 40, lng: -3 })

  const [page, setPage] = useState(1)

  useEffect(() => {
    if (page > 1) {
      getOffers({ province, page })
    }
  }, [page])

  useEffect(() => {
    setOffers([])
    getOffers({ province })
  }, [province])

  async function getOffers ({ province, page = 1 }) {
    if (province === '') return

    if (province === 'espana') province = ''

    setLoading(true)

    if (province) {
      const { lat, lng } = await getLatLon(`${province}, Spain`)
      setCenter({ lat, lng })
    }

    const url = new URL('/api/offers', window.location.origin)
    url.searchParams.set('province', province)
    url.searchParams.set('page', page)

    const q = sp.get('q')
    if (q) {
      url.searchParams.set('q', q)
    }

    const offers = await fetch(url).then((res) => res.json())

    const cities = offers.map((offer) => `${offer.city}, ${offer.province}, Spain`)
    const uniqueCities = [...new Set(cities)]

    for (const city of uniqueCities) {
      const { lat, lng } = await getLatLon(city)
      saveLocation(offers, city, lat, lng)
    }

    setOffers(prev => [...prev, ...offers])

    if (offers.length > 0 && page < LIMIT_PAGE_OFFERS) {
      setPage(page + 1)
    }

    if (offers.length === 0 || page === LIMIT_PAGE_OFFERS) {
      setLoading(false)
    }
  }

  async function getLatLon (name) {
    const dataJson = citiesJSON?.find(item => item.name === name)
    if (dataJson) {
      const { lat, lng } = dataJson
      return { lat, lng }
    }

    const localStorageCities = localStorage.getItem('cities') ? JSON.parse(localStorage.getItem('cities')) : []
    const localData = localStorageCities.find(item => item.name === name)
    if (localData) {
      const { lat, lng } = localData
      return { lat, lng }
    }

    const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${name}&apiKey=${GEOAPIFY_API}`).then((res) => res.json())
    const { lat, lon: lng } = response.features?.[0]?.properties || { lat: 0, lon: 0 }
    localStorage.setItem('cities', JSON.stringify([
      ...localStorageCities,
      {
        name,
        lat,
        lng
      }
    ]))
    return { lat, lng }
  }

  function saveLocation (offers, city, lat, lng) {
    const sameCity = offers.filter((offer) => `${offer.city}, ${offer.province}, Spain` === city)
    sameCity.forEach(item => {
      const rand1 = Math.random() < 0.5 ? -1 : 1
      const rand2 = Math.random() < 0.5 ? -1 : 1
      const num1 = Math.random() / 100 * rand1
      const num2 = Math.random() / 100 * rand2
      item.latitude = lat + num1
      item.longitude = lng + num2
    })
  }

  function capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  return (
    <>
      <h2 className='mb-4'>
        {title || (
        `${offers.length} ofertas ${sp.get('q') ? `de ${sp.get('q')}` : ''} en ${capitalize(province)}`
        )}
      </h2>
      <div style={{ height: '600px', width: '100%' }} className='relative rounded-[6px] overflow-hidden'>
        <Map center={center} offers={offers} loading={loading} />
      </div>
    </>
  )
}
