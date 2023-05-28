import { useEffect, useState } from 'react'
import { useRoute } from 'wouter'
import { provincesByPopularity } from '../consts'

export default function Search () {
  const [, params] = useRoute('/:province')

  const [province, setProvince] = useState(params?.province ?? '')
  const [provinces, setProvinces] = useState([])

  useEffect(() => {
    fetch('/api/provinces').then((res) => res.json()).then((data) => {
      setProvinces(data)
    })
  }, [])

  function handleSearch (e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const q = formData.get('q')

    window.location.href = `/${province}?q=${q}`
  }
  return (
    <div className='py-2 mt-11'>
      <h1 className='text-[42px] font-medium mb-4'>Siempre a mejor</h1>
      <div className='rounded-[6px] bg-[rgba(22,125,183,0.7)] p-8'>
        <form onSubmit={handleSearch}>
          <fieldset>
            <ul className='flex flex-col sm:flex-row items-end gap-2'>
              <li className='w-full'>
                <label htmlFor='q' className='block text-white'>Busco ofertas de...</label>
                <input
                  type='text' placeholder='Puesto, empresa o palabra clave' name='q' id='q' maxLength='200' data-vars='{&quot;autocompleteEnabled&quot;:true,&quot;autocompleteStrategy&quot;:&quot;&quot;,&quot;maxAutocompleteItemsDesktop&quot;:5,&quot;maxAutocompleteItemsMobile&quot;:3,&quot;urlAutocomplete&quot;:&quot;https://ms-autocomplete.spain.advgo.net/v1/search&quot;}'
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
                  <option value='0'>Toda España</option>
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
  )
}
