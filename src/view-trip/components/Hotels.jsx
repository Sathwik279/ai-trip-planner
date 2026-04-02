import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getOpenStreetMapUrl } from '@/lib/trip'
import { getPexelsPhoto } from '@/service/GlobalApi'

function Hotels({ trip }) {
  const [photoMap, setPhotoMap] = useState({})

  useEffect(() => {
    const hotels = trip?.tripData?.hotelOptions ?? []

    if (!hotels.length) {
      return;
    }

    let isCancelled = false

    async function loadPhotos() {
      const entries = await Promise.all(
        hotels.map(async (hotel, index) => {
          const key = hotel?.hotelName ?? `${hotel?.hotelAddress}-${index}`
          const photoUrl = await getPexelsPhoto(
            `${hotel?.hotelName || ''} hotel ${trip?.userSelection?.location || ''}`,
          )

          return [key, photoUrl || hotel?.hotelImageUrl || null]
        }),
      )

      if (!isCancelled) {
        setPhotoMap(Object.fromEntries(entries))
      }
    }

    loadPhotos()

    return () => {
      isCancelled = true
    }
  }, [trip])

  return (
    <div>
      <h2 className='my-7 text-xl font-bold'>Hotel Recommendation</h2>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3 xl:grid-cols-4'>
        {trip?.tripData?.hotelOptions?.map((hotel, index) => (
          <Link
            key={hotel?.hotelName ?? index}
            to={getOpenStreetMapUrl({
              geoCoordinates: hotel?.geoCoordinates,
              query: `${hotel?.hotelName || ''} ${hotel?.hotelAddress || ''}`,
            })}
            target='_blank'
          >
            <div className='cursor-pointer transition-all hover:scale-105'>
              <img
                src={photoMap[hotel?.hotelName ?? `${hotel?.hotelAddress}-${index}`] || "/road-trip-vocation.jpg"}
                className='h-[180px] w-full rounded-xl object-cover'
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className='my-2 flex flex-col gap-2'>
                <h2 className='font-medium'>{hotel?.hotelName}</h2>
                <h2 className='font-xs text-gray-500'>📍 {hotel?.hotelAddress}</h2>
                <h2 className='font-medium'>💰 {hotel?.price}</h2>
                <h2 className='font-medium'>⭐ {hotel?.rating}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <p className='mt-4 text-xs text-gray-400'>Photos via Pexels when available.</p>
    </div>
  )
}

export default Hotels
