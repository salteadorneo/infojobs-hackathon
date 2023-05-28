import { Route } from 'wouter'

import Nav from './components/Nav'
import Home from './pages/Home'
import Province from './pages/Province'
import Search from './components/Search'

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
      </main>
    </>
  )
}

export default App
