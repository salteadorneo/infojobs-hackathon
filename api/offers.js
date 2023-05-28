const infoJobsToken = process.env.INFOJOBS_TOKEN

export default async function handler (request, response) {
  const { province, page } = request.query

  const url = new URL('https://api.infojobs.net/api/7/offer')
  if (province) {
    url.searchParams.append('province', province)
  }
  url.searchParams.append('maxResults', 50)
  url.searchParams.append('page', page)
  url.searchParams.append('teleworking', 'trabajo-solo-presencial')

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${infoJobsToken}`
    }
  })

  const { items } = await res.json()

  const listOfOffers = items?.map(item => {
    return {
      ...item,
      province: item.province.value,
      latitude: 40,
      longitude: -3
    }
  }).filter(Boolean)

  response.status(200).json(listOfOffers || [])
}
