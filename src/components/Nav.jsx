import { Logo } from '../Logo'

export default function Nav () {
  return (
    <ul className='flex items-center gap-8'>
      <li>
        <a href='#'>
          <Logo />
        </a>
      </li>
      <li>
        <a href='#' id='menu_tab_25' title='Buscar empleo' data-track-properties='{&quot;section&quot;:&quot;candidate&quot;}' data-track='Search Offers Main Menu Clicked'>
          Buscar empleo
        </a>
      </li>
      <li>
        <a href='#' id='menu_tab_33' title='Buscar empresas' data-track-properties='{&quot;section&quot;:&quot;candidate&quot;}' data-track='Search Companies Main Menu Clicked'>
          Buscar empresas
        </a>
      </li>
      <li>
        <a href='#' id='menu_tab_34' title='Salarios' data-track-properties='{&quot;section&quot;:&quot;candidate&quot;}' data-track='Salary Main Menu Clicked'>
          Salarios
        </a>
      </li>
      <li>
        <a href='#' id='menu_tab_2' title='Qué puedo estudiar para trabajar - Formación InfoJobs' data-track-properties='{&quot;section&quot;:&quot;candidate&quot;}' data-track='Training Main Menu Clicked'>
          Formación
        </a>
      </li>
    </ul>
  )
}
