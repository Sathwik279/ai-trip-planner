import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <div className='my-8 flex flex-col items-center gap-3'>
      <Link to="/">
        <span className='text-sm text-gray-500 underline underline-offset-4'>Go to home page</span>
      </Link>
      <h2 className='text-center text-gray-400'>Travel Planner App powered by Groq, OpenStreetMap, and Pexels</h2>
    </div>
  )
}

export default Footer
