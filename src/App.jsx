import { useEffect, useState } from 'react'
import Map from './components/Map'
import Nav from './components/Nav'
import { provincesByPopularity } from './consts'

function App () {
  const [province, setProvince] = useState('')
  const [provinces, setProvinces] = useState([])

  const [offers, setOffers] = useState([])

  const [center, setCenter] = useState({ lat: 40, lng: -3 })

  const [page, setPage] = useState(1)

  useEffect(() => {
    fetch('/api/provinces').then((res) => res.json()).then((data) => {
      setProvinces(data)
    })
  }, [])

  useEffect(() => {
    getOffers({ province, page })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  useEffect(() => {
    getOffers({ province })
  }, [province])

  async function getOffers ({ province, page = 1 }) {
    if (province === '') return

    if (province) {
      const localStorageCities = localStorage.getItem('cities') ? JSON.parse(localStorage.getItem('cities')) : []

      if (localStorageCities.includes(province)) {
        const { lat, lng } = JSON.parse(localStorage.getItem(province)) || { lat: 0, lng: 0 }
        setCenter({ lat, lng })
      } else {
        const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${province},Spain&apiKey=61b7eee1ab8347ee889583cc7342a5a4`).then((res) => res.json())

        const { lat, lon } = response.features[0].properties
        setCenter({ lat, lng: lon })

        localStorage.setItem(province, JSON.stringify({ lat, lng: lon }))
        localStorage.setItem('cities', JSON.stringify([...localStorageCities, province]))
      }
    }

    const offers = await fetch(`/api/offers?province=${province}&page=${page}`).then((res) => res.json())

    const cities = offers.map((offer) => `${offer.city}, ${offer.province}, Spain`)
    const uniqueCities = [...new Set(cities)]

    for (const city of uniqueCities) {
      const localStorageCities = localStorage.getItem('cities') ? JSON.parse(localStorage.getItem('cities')) : []

      if (localStorageCities.includes(city)) {
        const { lat, lng } = JSON.parse(localStorage.getItem(city)) || { lat: 0, lng: 0 }
        const sameCity = offers.filter((offer) => `${offer.city}, ${offer.province}, Spain` === city)
        sameCity.forEach((item, i) => {
          item.latitude = lat + i * Math.random() * 5000
          item.longitude = lng + i * Math.random() * 5000
        })
        continue
      }

      const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${city}&apiKey=61b7eee1ab8347ee889583cc7342a5a4`).then((res) => res.json())

      const { lat, lon } = response.features[0].properties
      const sameCity = offers.filter((offer) => `${offer.city}, ${offer.province}, Spain` === city)
      sameCity.forEach((item, i) => {
        item.latitude = lat + i * Math.random() * 5000
        item.longitude = lon + i * Math.random() * 5000
      })

      localStorage.setItem(city, JSON.stringify({ lat, lng: lon }))
      localStorage.setItem('cities', JSON.stringify([...localStorageCities, city]))
    }

    setOffers(prev => [...prev, ...offers])

    if (offers.length > 0 && page < 5) {
      setPage(page + 1)
    }
  }

  return (
    <>
      <header className='py-7 bg-[#f2f2f2] bg-cover bg-center' style={{ backgroundImage: 'url(/bg-home-full-tv.jpg)' }}>
        <div className='max-w-[1280px] mx-auto px-6'>
          <Nav />
          <div className='py-2 mt-11'>
            <h1 className='text-[42px] font-medium mb-4'>Siempre a mejor</h1>
            <div className='rounded-[6px] bg-[rgba(22,125,183,0.7)] p-8'>
              <form>
                <fieldset>
                  <ul className='flex items-end gap-2'>
                    <li className='w-full'>
                      <label htmlFor='palabra' className='block text-white'>Busco ofertas de...</label>
                      <input
                        type='text' placeholder='Puesto, empresa o palabra clave' name='palabra' id='palabra' maxLength='200' data-vars='{&quot;autocompleteEnabled&quot;:true,&quot;autocompleteStrategy&quot;:&quot;&quot;,&quot;maxAutocompleteItemsDesktop&quot;:5,&quot;maxAutocompleteItemsMobile&quot;:3,&quot;urlAutocomplete&quot;:&quot;https://ms-autocomplete.spain.advgo.net/v1/search&quot;}'
                        className='w-full p-2' autoComplete='off' role='textbox' aria-autocomplete='list' aria-haspopup='true'
                      />
                      <div className='input-drop-down' />
                    </li>
                    <li className='w-full'>
                      <label htmlFor='of_provincia' className='block text-white'>en...</label>
                      <select
                        className='w-full p-2'
                        data-placeholder='Toda España'
                        title='Selecciona una de las opciones o escribe tu opción'
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                      >
                        <option value='0' selected='true'>Toda España</option>
                        <optgroup label='Más comunes'>
                          {provincesByPopularity.map((province) => (
                            <option key={province.key} value={province.key}>{province.value}</option>
                          ))}
                        </optgroup>
                        <optgroup label='Todas'>
                          {provinces.filter(p => p.key !== 'seleccionar').map((province) => (
                            <option key={province.key} value={province.key}>{province.value}</option>
                          ))}
                        </optgroup>
                      </select>
                    </li>
                    <li className=''>
                      <button
                        type='submit'
                        className='text-white bg-[#ff6340] rounded px-10 py-2 uppercase'
                        title='Buscar trabajo con mis preferencias'
                        data-track-properties='{&quot;section&quot;:&quot;candidate&quot;}'
                        data-track='Search Offers Clicked'
                      >
                        Buscar
                      </button>
                    </li>
                  </ul>
                </fieldset>
              </form>

            </div>
          </div>
        </div>
      </header>

      <main className='max-w-[1280px] mx-auto p-6'>
        {province === '' && (
          <>
            <h2 className='text-xl font-semibold mb-4'>Trabaja cerca de casa</h2>
            <div className='grid grid-cols-4 gap-4'>
              {
              provincesByPopularity.map((province) => (
                <div key={province.key} className='group space-y-2' onClick={() => setProvince(province.key)}>
                  <img src={`/images/${province.key}.jpg`} alt={province.value} className='aspect-square object-cover rounded-[6px]' />
                  <span className='block text-[#167db7] uppercase font-semibold text-center group-hover:underline'>{province.value}</span>
                </div>
              ))
            }
            </div>
          </>
        )}
        <div style={{ height: '600px', width: '100%' }} className='relative rounded-[6px] overflow-hidden'>
          {province !== '' && (
            <Map center={center} offers={offers} />
          )}
        </div>
      </main>
    </>
  )
}

export default App
