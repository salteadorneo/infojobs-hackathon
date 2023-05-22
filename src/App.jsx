import { useEffect, useState } from 'react'
import { Logo } from './Logo'

function App () {
  const [offers, setOffers] = useState([])

  useEffect(() => {
    fetch('/api/offers').then((res) => res.json()).then((data) => {
      setOffers(data)
    })
  }, [])

  return (
    <>
      <Logo />
      {offers.map((offer) => (
        <div key={offer.id}>
          <p>{offer.title}</p>
        </div>
      ))}
    </>
  )
}

export default App
