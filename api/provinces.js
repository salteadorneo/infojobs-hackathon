const infoJobsToken = process.env.INFOJOBS_TOKEN

export default async function handler (request, response) {
  const url = new URL('https://api.infojobs.net/api/1/dictionary/province')
  url.searchParams.append('parent', 17)

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${infoJobsToken}`
    }
  })

  const items = await res.json()

  response.status(200).json(items)
}
