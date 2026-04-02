import { Button } from '@/components/ui/button';
import { db } from '@/service/firebaseConfig';
import { getAllLocalTrips, getLocationLabel } from '@/lib/trip';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    const localTrips = getAllLocalTrips();
    setTrips(localTrips);

    try {
      const snapshot = await getDocs(collection(db, 'AiTrips'));
      const remoteTrips = snapshot.docs.map((item) => item.data());
      const mergedTrips = [...localTrips];
      const existingIds = new Set(localTrips.map((trip) => trip.id));

      remoteTrips.forEach((trip) => {
        if (!existingIds.has(trip.id)) {
          mergedTrips.push(trip);
        }
      });

      mergedTrips.sort((a, b) => Number(b?.id ?? 0) - Number(a?.id ?? 0));
      setTrips(mergedTrips);
    } catch (error) {
      console.error(error);
      toast('Showing local trips only. Firestore trip history is unavailable right now.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className='p-10 text-center text-gray-500'>Loading your trips...</div>;
  }

  return (
    <div className='mx-auto max-w-6xl px-5 py-10 md:px-10'>
      <div className='mb-8 flex flex-wrap items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold'>My Trips</h1>
          <p className='mt-2 text-gray-500'>See the trips you already generated and reopen them anytime.</p>
        </div>
        <Link to="/create-trip">
          <Button>Create New Trip</Button>
        </Link>
      </div>

      {!trips.length ? (
        <div className='rounded-2xl border bg-white/80 p-8 text-center text-gray-500'>
          No trips yet. Create one and it will show up here.
        </div>
      ) : (
        <div className='grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
          {trips.map((trip) => (
            <Link
              key={trip.id}
              to={`/view-trip/${trip.id}`}
              className='rounded-2xl border bg-white/80 p-5 transition hover:-translate-y-1 hover:shadow-lg'
            >
              <img
                src="/road-trip-vocation.jpg"
                className='h-[180px] w-full rounded-xl object-cover'
              />
              <div className='mt-4 space-y-2'>
                <h2 className='text-xl font-semibold'>{getLocationLabel(trip?.userSelection?.location) || 'Untitled Trip'}</h2>
                <p className='text-sm text-gray-500'>
                  {trip?.userSelection?.noOfDays || '-'} days • {trip?.userSelection?.budget || '-'} • {trip?.userSelection?.traveler || '-'}
                </p>
                <p className='text-sm text-gray-600'>
                  {trip?.tripData?.tripDetails?.note || 'AI-generated itinerary with hotels and places to visit.'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyTrips
