/* eslint-disable react/prop-types */
import React from 'react'
import PlaceCardItem from './PlaceCardItem'
import { getBestTimeToVisit } from '@/lib/trip'

function PlacesToVisit({ trip }) {
  return (
    <div>
      <h2 className='mb-7 mt-10 text-lg font-bold'>Places to Visit</h2>
      <div>
        {trip?.tripData && typeof trip.tripData.itinerary === 'object' ? (
          Object.entries(trip.tripData.itinerary).map(([day, info]) => (
            <div key={day} className='mt-5'>
              <h3 className='text-lg font-medium'>{day}</h3>
              <p className='text-sm font-medium text-orange-400'>{getBestTimeToVisit(info)}</p>
              {info?.theme ? <p className='mt-1 text-sm text-gray-500'>{info.theme}</p> : null}
              <div className='grid gap-5 md:grid-cols-2'>
                {(info?.places || []).map((place, index) => (
                  <div key={index} className='my-3'>
                    <PlaceCardItem place={place} />
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No itinerary available</p>
        )}
      </div>
    </div>
  )
}

export default PlacesToVisit
