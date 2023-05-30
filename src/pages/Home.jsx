import { Link } from 'wouter'
import { provincesByPopularity } from '../consts'

export default function Home () {
  return (
    <>
      <h2 className='text-xl font-semibold mb-4'>Ciudades con más ofertas</h2>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {provincesByPopularity.map((province) => (
          <Link href={`/${province.key}`} key={province.key} className='group space-y-2'>
            <img src={`/images/${province.key}.jpg`} alt={province.value} className='aspect-square object-cover rounded-[6px] group-hover:shadow-lg transition-all duration-300' />
            <span className='block text-[#167db7] uppercase font-semibold text-center group-hover:underline'>{province.value}</span>
          </Link>
        ))}
      </div>
    </>
  )
}
