import React from 'react';
import { Button } from '@/components/ui/button'
import { FaShare } from "react-icons/fa6";
import { getLocationLabel } from '@/lib/trip';

function InfoSection({ trip }) {
  return (
    <div className='mx-auto max-w-xl'>
      <img className='h-[200px] w-full rounded-xl object-cover sm:h-[280px] md:h-[340px]' src="/road-trip-vocation.jpg" alt="" />

      <div className='mt-5 flex flex-col items-start justify-between sm:flex-row sm:items-center'>
        <div className='flex flex-col gap-2'>
          <h2 className='mt-2 text-lg font-bold sm:mt-0 sm:text-xl md:text-2xl'>{getLocationLabel(trip?.userSelection?.location)}</h2>
          <div className='mt-2 flex flex-wrap gap-3 sm:gap-5'>
            <h2 className='rounded-full bg-gray-200 p-1 px-3 text-xs text-gray-500 md:text-sm'>
              📆 {trip?.userSelection?.noOfDays} Day
            </h2>
            <h2 className='rounded-full bg-gray-200 p-1 px-3 text-xs text-gray-500 md:text-sm'>
              💰 {trip?.userSelection?.budget} Budget
            </h2>
            <h2 className='rounded-full bg-gray-200 p-1 px-3 text-xs text-gray-500 md:text-sm'>
              💏 No. of traveler: {trip?.userSelection?.traveler}
            </h2>
          </div>
        </div>
        <Button className='mt-3 sm:ml-5 sm:mt-0'>
          <FaShare />
        </Button>
      </div>
    </div>
  )
}

export default InfoSection
