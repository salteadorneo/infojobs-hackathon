import { Logo } from './Logo'

export default function Nav () {
  return (
    <ul className='flex flex-row items-center gap-8'>
      <li>
        <a href='/'>
          <Logo />
        </a>
      </li>
      <li className='max-sm:hidden'>
        <a href='#' title='Buscar empleo'>
          Buscar empleo
        </a>
      </li>
      <li className='max-sm:hidden'>
        <a href='#' title='Buscar empresas'>
          Buscar empresas
        </a>
      </li>
      <li className='max-sm:hidden'>
        <a href='#' title='Salarios'>
          Salarios
        </a>
      </li>
      <li className='max-sm:hidden'>
        <a href='#' title='Qué puedo estudiar para trabajar - Formación InfoJobs'>
          Formación
        </a>
      </li>
    </ul>
  )
}
