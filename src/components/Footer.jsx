import { GitHub } from './GitHub'

export default function Footer ({ provinces = [] }) {
  return (
    <footer className='max-w-[1280px] mx-auto p-6'>

      <h3 className='text-xl font-semibold mb-4'>
        Empleo por provincias
      </h3>
      {provinces.length && (
        <ul className='grid grid-cols-4'>
          {provinces.filter(p => p.key !== 'seleccionar').map((province) => (
            <li key={province.key} className='leading-none mb-1.5'>
              <a href={`/${province.key}`} title={`Trabajo en ${province.value}`} className='text-xs leading-none text-gray-600 hover:underline'>
                Trabajo en {province.value}
              </a>
            </li>
          ))}
        </ul>
      )}

      <p className='flex items-center justify-center gap-2 text-xs mt-8'>
        <span className='flex items-center justify-center gap-2 text-xs text-gray-500'>
          Nota: para la demo se listan máximo 200 ofertas por provincia.
        </span>
        <strong>
          Cristian Adán
        </strong>
        <a href='https://github.com/salteadorneo/infojobs-hackathon' target='_blank' rel='noreferrer' className='flex items-center gap-1 hover:underline'>
          <GitHub /> salteadorneo/infojobs-hackathon
        </a>
      </p>
    </footer>
  )
}
