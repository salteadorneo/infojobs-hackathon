import { useEffect, useState } from 'react'
import Map from '../components/Map'

const GEOAPIFY_API = import.meta.env.VITE_GEOAPIFY_API

// eslint-disable-next-line react/prop-types
export default function Province ({ params }) {
  // eslint-disable-next-line react/prop-types
  const { province } = params

  const queryString = window.location.search
  const sp = new URLSearchParams(queryString)

  const [offers, setOffers] = useState([])

  const [center, setCenter] = useState({ lat: 40, lng: -3 })

  const [page, setPage] = useState(1)

  useEffect(() => {
    if (page > 1) {
      getOffers({ province, page })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  useEffect(() => {
    setOffers([])
    getOffers({ province })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [province])

  async function getOffers ({ province, page = 1 }) {
    if (province === '') return

    if (province === 'espana') province = ''

    if (province) {
      const localStorageCities = localStorage.getItem('cities') ? JSON.parse(localStorage.getItem('cities')) : []

      if (localStorageCities.includes(province)) {
        const { lat, lng } = JSON.parse(localStorage.getItem(province)) || { lat: 0, lng: 0 }
        setCenter({ lat, lng })
      } else {
        const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${province},Spain&apiKey=${GEOAPIFY_API}`).then((res) => res.json())

        const { lat, lon } = response.features[0].properties
        setCenter({ lat, lng: lon })

        localStorage.setItem(province, JSON.stringify({ lat, lng: lon }))
        localStorage.setItem('cities', JSON.stringify([...localStorageCities, province]))
      }
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
      const localStorageCities = localStorage.getItem('cities') ? JSON.parse(localStorage.getItem('cities')) : []

      if (localStorageCities.includes(city)) {
        const { lat, lng } = JSON.parse(localStorage.getItem(city)) || { lat: 0, lng: 0 }
        saveLocation(offers, city, lat, lng)
        continue
      }

      const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${city}&apiKey=${GEOAPIFY_API}`).then((res) => res.json())
      const { lat, lon: lng } = response.features?.[0]?.properties || { lat: 0, lon: 0 }
      saveLocation(offers, city, lat, lng)

      localStorage.setItem(city, JSON.stringify({ lat, lng }))
      localStorage.setItem('cities', JSON.stringify([...localStorageCities, city]))
    }

    setOffers(prev => [...prev, ...offers])

    if (offers.length > 0 && page < 5) {
      setPage(page + 1)
    }
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

  return (
    <>
      <h2 className='mb-4'>{offers.length} ofertas en <span className='capitalize'>{province}</span></h2>
      <div style={{ height: '600px', width: '100%' }} className='relative rounded-[6px] overflow-hidden'>
        <Map center={center} offers={offers} />
      </div>
    </>
  )
}
