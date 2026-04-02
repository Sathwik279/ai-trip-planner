import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { getOpenStreetMapUrl } from '@/lib/trip';
import { getPexelsPhoto } from '@/service/GlobalApi';

function PlaceCardItem({ place }) {
  const [photoUrl, setPhotoUrl] = useState(place?.placeImageUrl || null)

  useEffect(() => {
    let isCancelled = false

    async function loadPhoto() {
      const nextPhotoUrl = await getPexelsPhoto(place?.placeName || '')

      if (!isCancelled) {
        setPhotoUrl(nextPhotoUrl || place?.placeImageUrl || null)
      }
    }

    loadPhoto()

    return () => {
      isCancelled = true
    }
  }, [place])

  return (
    <div>
      <Link
        to={getOpenStreetMapUrl({
          geoCoordinates: place?.geoCoordinates,
          query: place?.placeName || '',
        })}
        target='_blank'
      >
        <div className='my-4 flex gap-2 rounded-lg border bg-gray-50 p-2 transition-all hover:scale-105 hover:shadow-md'>
          <div className='mx-3 py-2'>
            <img
              src={photoUrl || '/road-trip-vocation.jpg'}
              className='h-[140px] w-[140px] rounded-xl object-cover'
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className='flex-1'>
            <h2 className='font-bold'>{place?.placeName}</h2>
            <p className='text-sm text-gray-500'>{place?.placeDetails}</p>
            <h2 className='text-sm text-blue-700'>{place?.ticketPricing}</h2>
            <h2 className='text-sm text-gray-500'>{place?.timeTravel}</h2>
            <h2 className='text-sm text-yellow-500'>⭐ {place?.rating}</h2>
          </div>
          <div className='mt-auto'>
            <Button><FaLocationDot /></Button>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default PlaceCardItem
