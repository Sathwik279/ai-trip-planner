import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div className='mx-auto flex min-h-[calc(100vh-73px)] max-w-6xl flex-col justify-center gap-10 px-5 py-16 md:px-10'>
      <div className='max-w-4xl'>
        <p className='mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500'>
          AI Trip Planner
        </p>
        <h1 className='text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl'>
          Build a practical travel plan in minutes, with stays, sights, and a day-by-day route.
        </h1>
        <p className='mt-6 max-w-2xl text-lg text-gray-600'>
          Tell us where you want to go, how long you have, your budget, and who is joining. We will turn it into a clean itinerary you can save and revisit.
        </p>
      </div>

      <div className='flex flex-col gap-4 sm:flex-row'>
        <Link to={'/create-trip'}>
          <Button className='w-full sm:w-auto'>Start Planning</Button>
        </Link>
        <a
          href="#how-it-works"
          className='inline-flex items-center justify-center rounded-md border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50'
        >
          See How It Works
        </a>
      </div>

      <div id="how-it-works" className='grid gap-4 md:grid-cols-3'>
        <div className='rounded-2xl border bg-orange-50 p-5'>
          <p className='text-sm font-semibold text-orange-600'>1. Describe the trip</p>
          <p className='mt-2 text-sm text-gray-700'>Enter the destination, trip length, budget, and group size.</p>
        </div>
        <div className='rounded-2xl border bg-amber-50 p-5'>
          <p className='text-sm font-semibold text-amber-700'>2. Generate the plan</p>
          <p className='mt-2 text-sm text-gray-700'>The planner creates hotel suggestions and a day-by-day itinerary.</p>
        </div>
        <div className='rounded-2xl border bg-slate-50 p-5'>
          <p className='text-sm font-semibold text-slate-700'>3. Save and revisit</p>
          <p className='mt-2 text-sm text-gray-700'>Your generated trip is stored in Firebase so you can open it again later.</p>
        </div>
      </div>
    </div>
  )
}

export default Hero
