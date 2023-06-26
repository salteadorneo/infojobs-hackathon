import { useEffect, useState } from 'react'
import { Route } from 'wouter'

import Nav from './components/Nav'
import Home from './pages/Home'
import Province from './pages/Province'
import Search from './components/Search'
import Footer from './components/Footer'

function App () {
  const [provinces, setProvinces] = useState([])

  useEffect(() => {
    fetch('/api/provinces').then((res) => res.json()).then((data) => {
      setProvinces(data)
    })
  }, [])

  return (
    <>
      <a
        href='https://salteadorneo.dev/blog/infojobs-hackathon-midudev'
        className='fixed right-0 bg-[#ff6340] hover:bg-[#ff6340]/70 text-white py-2 origin-top mt-9 mr-9 w-72 text-center translate-x-1/2 rotate-45'
      >
        <p className='font-bold'>3<sup>er</sup> premio</p>
        <p className='text-xs'>InfoJobs Hackathon @midudev</p>
      </a>

      <header className='py-7 bg-[#f2f2f2] bg-cover bg-center' style={{ backgroundImage: 'url(/bg-home-full-tv.jpg)' }}>
        <div className='max-w-[1280px] mx-auto px-6'>
          <Nav />
          <Search provinces={provinces} />
        </div>
      </header>

      <main className='max-w-[1280px] mx-auto p-6'>
        <Route path='/' component={Home} />
        <Route path='/:province' component={Province} />
      </main>

      <Footer provinces={provinces} />
    </>
  )
}

export default App
