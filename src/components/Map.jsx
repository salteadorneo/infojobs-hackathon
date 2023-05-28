import GoogleMapReact from 'google-map-react'
import { useEffect, useRef, useState } from 'react'
import useSupercluster from 'use-supercluster'

const DEFAULT_IMAGE = 'https://components.infojobs.com/statics/images/pic-company-logo.png'

// eslint-disable-next-line react/prop-types
export default function Map ({ center, offers = [] }) {
  const mapRef = useRef()
  const [bounds, setBounds] = useState(null)
  const [zoom, setZoom] = useState(10)

  const [detail, setDetail] = useState(null)

  const points = offers.map(offer => ({
    ...offer,
    type: 'Feature',
    properties: { cluster: false, id: offer.id, category: offer.category },
    geometry: {
      type: 'Point',
      coordinates: [
        offer.longitude,
        offer.latitude
      ]
    }
  }))

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom
  })

  useEffect(() => {
    if (center && mapRef.current) {
      setDetail(null)
      setZoom(10)

      mapRef.current.setZoom(10)

      const { lat, lng } = center || { lat: 0, lng: 0 }
      mapRef.current.panTo({ lat, lng })
    }
  }, [center])

  const Marker = ({ children }) => children

  return (
    <>
      {detail && (
        <a href={detail.link} target='_blank' className='absolute top-2 left-2 z-10 shadow-lg w-[500px] bg-white p-4 rounded flex gap-4' rel='noreferrer'>
          <img src={detail.author?.logoUrl || DEFAULT_IMAGE} alt='' className='w-16 h-16 border' />
          <div>
            <p><strong>{detail.title}</strong></p>
            <p>{detail.author?.name}</p>
            <p className='text-sm text-gray-600'>{detail.city} | Presencial | {new Date(detail.updated).toLocaleDateString()}</p>
            <p className='text-sm text-gray-600'>{detail.contractType?.value} | {detail.workDay?.value} | {detail.salaryDescription}</p>
          </div>
        </a>
      )}
      <GoogleMapReact
        bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY }}
        defaultCenter={{ lat: 40, lng: -3 }}
        defaultZoom={6}
        options={{
          fullscreenControl: false
        }}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map }) => {
          mapRef.current = map
        }}
        onChange={({ zoom, bounds }) => {
          setDetail(null)
          setZoom(zoom)
          setBounds([
            bounds.nw.lng,
            bounds.se.lat,
            bounds.se.lng,
            bounds.nw.lat
          ])
        }}
      >
        {clusters.map(cluster => {
          const [longitude, latitude] = cluster.geometry.coordinates
          const {
            cluster: isCluster,
            point_count: pointCount
          } = cluster.properties

          if (isCluster) {
            return (
              <Marker
                key={`cluster-${cluster.id}`}
                lat={latitude}
                lng={longitude}
              >
                <div
                  className='grid place-content-center bg-[#167DB7] text-lg rounded-full text-white'
                  style={{
                    width: `${30 + (pointCount / points.length) * 20}px`,
                    height: `${30 + (pointCount / points.length) * 20}px`
                  }}
                  onClick={() => {
                    const expansionZoom = Math.min(
                      supercluster.getClusterExpansionZoom(cluster.id),
                      20
                    )
                    mapRef.current.setZoom(expansionZoom)
                    mapRef.current.panTo({ lat: latitude, lng: longitude })
                  }}
                >
                  {pointCount}
                </div>
              </Marker>
            )
          }

          return (
            <Marker
              key={`marker-${cluster.id}`}
              lat={latitude}
              lng={longitude}
            >
              <span
                title={cluster.title}
                onClick={() => {
                  setDetail(cluster)
                }}
              >
                <svg width='25' height='24' viewBox='0 0 25 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path fillRule='evenodd' clipRule='evenodd' d='M12.8456 2C8.66159 2.00551 5.27113 5.39597 5.26562 9.58C5.26562 12.43 7.18563 16.3 10.9756 21.09C11.4264 21.664 12.1157 21.9995 12.8456 22C13.5755 21.9995 14.2648 21.664 14.7156 21.09C18.5056 16.3 20.4256 12.43 20.4256 9.58C20.4201 5.39597 17.0297 2.00551 12.8456 2ZM15.2156 10.48C14.9725 11.0656 14.5093 11.5324 13.9256 11.78C13.5836 11.9237 13.2166 11.9984 12.8456 12C12.1583 12.0026 11.4989 11.7287 11.0156 11.24C10.2525 10.4743 10.038 9.31851 10.4756 8.33C10.7145 7.7312 11.1824 7.25248 11.7756 7C12.7641 6.55624 13.9239 6.76936 14.6901 7.53552C15.4563 8.30168 15.6694 9.46153 15.2256 10.45L15.2156 10.48Z' fill='#167DB7' />
                </svg>
              </span>
            </Marker>
          )
        })}
      </GoogleMapReact>
    </>
  )
}
