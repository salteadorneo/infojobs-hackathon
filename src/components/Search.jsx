import { useState } from 'react'
import { useRoute } from 'wouter'
import { provincesByPopularity } from '../consts'

export default function Search ({ provinces = [] }) {
  const [, params] = useRoute('/:province')

  const [province, setProvince] = useState(params?.province ?? 'espana')

  const queryString = window.location.search
  const sp = new URLSearchParams(queryString)

  function handleSearch (e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const q = formData.get('q')

    const url = new URL(`/${province}`, window.location.origin)
    if (q) {
      url.searchParams.set('q', q.replace(/ñ/g, 'n'))
    }

    window.location.href = url
  }
  return (
    <div className='py-2 mt-11'>
      <h1 className='text-[42px] font-medium mb-4'>Trabaja cerca de casa</h1>
      <div className='rounded-[6px] bg-[rgba(22,125,183,0.7)] p-8'>
        <form onSubmit={handleSearch}>
          <fieldset>
            <ul className='flex flex-col sm:flex-row items-end gap-2'>
              <li className='w-full'>
                <label htmlFor='q' className='block text-white'>Busco ofertas de...</label>
                <input
                  type='text'
                  placeholder='Puesto, empresa o palabra clave'
                  name='q'
                  id='q'
                  maxLength='200'
                  className='w-full p-2'
                  autoComplete='off'
                  role='textbox'
                  aria-autocomplete='list'
                  aria-haspopup='true'
                  defaultValue={sp.get('q') ?? ''}
                />
                <div className='input-drop-down' />
              </li>
              <li className='w-full'>
                <label htmlFor='of_provincia' className='block text-white'>en...</label>
                <select
                  className='w-full p-2'
                  title='Selecciona una de las opciones o escribe tu opción'
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                >
                  <option value='espana'>Toda España</option>
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
