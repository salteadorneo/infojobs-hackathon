// eslint-disable-next-line no-undef
const infoJobsToken = process.env.INFOJOBS_TOKEN

export default async function handler(request, response) {
  const res = await fetch('https://api.infojobs.net/api/7/offer?category=informatica-telecomunicaciones', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${infoJobsToken}`
    }
  })

  const { items } = await res.json()

  const listOfOffers = items.map(item => {
    const { id, title, province, experienceMin, link, teleworking } = item

    return {
      id,
      title,
      province: province.value,
      experienceMin: experienceMin.value,
      link,
      teleworking: teleworking?.value ?? 'No especificado'
    }
  })

  response.status(200).json(listOfOffers);
}