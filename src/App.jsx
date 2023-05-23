import { useEffect, useState } from 'react'
import { Logo } from './Logo'
import GoogleMapReact from 'google-map-react'

const url = 'https://free-geo-ip.p.rapidapi.com/json/' // TODO IP
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'free-geo-ip.p.rapidapi.com'
  }
}

function App () {
  const [offers, setOffers] = useState([])
  const [center, setCenter] = useState({ lat: 40, lng: -3 })
  const [zoom] = useState(11)

  const [province, setProvince] = useState('madrid')
  const [provinces, setProvinces] = useState([])

  const Marker = ({ text }) => (
    <span title={text}>
      <svg width='25' height='24' viewBox='0 0 25 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path fillRule='evenodd' clipRule='evenodd' d='M12.8456 2C8.66159 2.00551 5.27113 5.39597 5.26562 9.58C5.26562 12.43 7.18563 16.3 10.9756 21.09C11.4264 21.664 12.1157 21.9995 12.8456 22C13.5755 21.9995 14.2648 21.664 14.7156 21.09C18.5056 16.3 20.4256 12.43 20.4256 9.58C20.4201 5.39597 17.0297 2.00551 12.8456 2ZM15.2156 10.48C14.9725 11.0656 14.5093 11.5324 13.9256 11.78C13.5836 11.9237 13.2166 11.9984 12.8456 12C12.1583 12.0026 11.4989 11.7287 11.0156 11.24C10.2525 10.4743 10.038 9.31851 10.4756 8.33C10.7145 7.7312 11.1824 7.25248 11.7756 7C12.7641 6.55624 13.9239 6.76936 14.6901 7.53552C15.4563 8.30168 15.6694 9.46153 15.2256 10.45L15.2156 10.48Z' fill='#167DB7' />
      </svg>
    </span>
  )

  useEffect(() => {
    // fetch(url, options).then(res => res.json()).then(data => {
    //   const { latitude, longitude } = data
    //   if (!latitude || !longitude) return console.log('No location')
    //   setCenter({ lat: latitude, lng: longitude })
    // }).catch(err => console.log(err))

    fetch('/api/provinces').then((res) => res.json()).then((data) => {
      setProvinces(data)
    })
  }, [])

  useEffect(() => {
    fetch(`/api/offers?province=${province}`).then((res) => res.json()).then((data) => {
      const offers = data.map((offer) => ({
        id: offer.id,
        title: offer.title,
        city: offer.city,
        province: offer.province,
        lat: 0,
        lng: 0
      }))
      setOffers(offers)
    })
  }, [province])

  const getMapBounds = (map, maps, places) => {
    const bounds = new maps.LatLngBounds()

    places.forEach((place) => {
      bounds.extend(new maps.LatLng(
        place.lat,
        place.lng
      ))
    })
    return bounds
  }

  async function handleApiLoaded (map, maps) {
    const geocoder = new maps.Geocoder()

    const cities = offers.map((offer) => `${offer.city}, ${offer.province}, Spain`)
    const uniqueCities = [...new Set(cities)]

    const offersDraft = structuredClone(offers)

    for (const city of uniqueCities) {
      const localStorageCities = localStorage.getItem('cities') ? JSON.parse(localStorage.getItem('cities')) : []

      if (localStorageCities.includes(city)) {
        const { lat, lng } = JSON.parse(localStorage.getItem(city)) || { lat: 0, lng: 0 }
        console.log({ city, lat, lng })
        const offersCity = offersDraft.filter((offer) => `${offer.city}, ${offer.province}, Spain` === city)
        offersCity.forEach((offer, i) => {
          offer.lat = lat + i * 0.0001
          offer.lng = lng
        })
        continue
      }

      const response = await geocoder.geocode({ address: city })

      const { lat, lng } = response.results[0].geometry.location
      console.log('online', { city, lat: lat(), lng: lng() })
      const offersCity = offersDraft.filter((offer) => `${offer.city}, ${offer.province}, Spain` === city)
      offersCity.forEach((offer, i) => {
        offer.lat = lat() + i * 0.0001
        offer.lng = lng()
      })

      localStorage.setItem(city, JSON.stringify({ lat: lat(), lng: lng() }))
      localStorage.setItem('cities', JSON.stringify([...localStorageCities, city]))
    }
    setOffers(offersDraft)

    const bounds = getMapBounds(map, maps, offersDraft)
    // Fit map to bounds
    map.fitBounds(bounds)
    // Bind the resize listener
    bindResizeListener(map, maps, bounds)
  }

  const bindResizeListener = (map, maps, bounds) => {
    maps.event.addDomListenerOnce(map, 'idle', () => {
      maps.event.addDomListener(window, 'resize', () => {
        map.fitBounds(bounds)
      })
    })
  }

  if (!offers.length) return (<div>Loading...</div>)

  return (
    <>
      <Logo />
      <select
        value={province}
        onChange={(e) => setProvince(e.target.value)}
      >
        {provinces.map((province) => (
          <option key={province.key} value={province.key}>{province.value}</option>
        ))}
      </select>
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY }}
          defaultCenter={center}
          defaultZoom={zoom}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
        >
          {offers.map((offer) => (
            <Marker
              key={offer.id}
              lat={offer.lat}
              lng={offer.lng}
              text={offer.title}
            />
          ))}
        </GoogleMapReact>
      </div>
    </>
  )
}

export default App
