const infoJobsToken = process.env.INFOJOBS_TOKEN

export default async function handler (request, response) {
  const { province } = request.query

  const url = new URL('https://api.infojobs.net/api/7/offer')
  url.searchParams.append('province', province)
  // url.searchParams.append('maxResults', 2)

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${infoJobsToken}`
    }
  })

  const { items } = await res.json()

  const provinceFilter = province.toLowerCase()

  const listOfOffers = items?.map(item => {
    const { id, title, city, province, experienceMin, link } = item

    // if (province.value.toLowerCase() !== provinceFilter) return false

    return {
      id,
      title,
      city,
      province: province.value,
      experienceMin: experienceMin.value,
      link
    }
  }).filter(Boolean)

  response.status(200).json(listOfOffers || [])
}
