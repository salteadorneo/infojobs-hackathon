import { Route } from 'wouter'

import Nav from './components/Nav'
import Home from './pages/Home'
import Province from './pages/Province'
import Search from './components/Search'
import { GitHub } from './components/GitHub'

function App () {
  return (
    <>
      <header className='py-7 bg-[#f2f2f2] bg-cover bg-center' style={{ backgroundImage: 'url(/bg-home-full-tv.jpg)' }}>
        <div className='max-w-[1280px] mx-auto px-6'>
          <Nav />
          <Search />
        </div>
      </header>

      <main className='max-w-[1280px] mx-auto p-6'>
        <Route path='/' component={Home} />
        <Route path='/:province' component={Province} />
        <p className='flex items-center justify-center gap-2 text-xs mt-4'>
          Para la demo, se listan hasta 200 ofertas por provincia.
        </p>
        <p className='flex items-center justify-center gap-2 text-xs mt-4'>
          Cristian Adán <a href='https://github.com/salteadorneo/infojobs-hackathon' target='_blank' rel='noreferrer' className='flex items-center gap-2 hover:underline'><GitHub /> @salteadorneo/infojobs-hackathon</a>
        </p>
      </main>
    </>
  )
}

export default App
