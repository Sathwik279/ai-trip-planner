import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from '@/service/firebaseConfig'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'

function Header() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)

      if (currentUser) {
        localStorage.setItem(
          'user',
          JSON.stringify({
            name: currentUser.displayName,
            email: currentUser.email,
            picture: currentUser.photoURL,
          }),
        )
      } else {
        localStorage.removeItem('user')
      }
    })

    return unsubscribe
  }, [])

  const handleAuthClick = async () => {
    if (user) {
      await signOut(auth)
      return
    }

    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error(error)
      toast('Google sign-in is not configured in Firebase yet. Enable Google under Authentication > Sign-in method.')
    }
  }

  return (
    <div className='sticky top-0 z-20 border-b bg-white/90 px-5 py-3 backdrop-blur'>
      <div className='mx-auto flex max-w-6xl items-center justify-between'>
        <Link to="/" className='flex items-center gap-3'>
          <img src="/logo.svg" alt="Trip Planner" className='h-10' />
        </Link>
        <div className='flex items-center gap-3'>
          <Link to="/my-trips" className='hidden sm:block'>
            <Button variant="outline">My Trips</Button>
          </Link>
          <Link to="/create-trip" className='hidden sm:block'>
            <Button variant="outline">Plan A Trip</Button>
          </Link>
          {user?.displayName ? (
            <p className='hidden text-sm text-gray-600 sm:block'>
              {user.displayName}
            </p>
          ) : null}
          <Button onClick={handleAuthClick}>
            {user ? 'Sign Out' : 'Sign In'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Header
