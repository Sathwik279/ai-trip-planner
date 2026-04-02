import { db } from '@/service/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlaceToVisit';
import Footer from '../components/Footer';
import { getLocalTrip } from '@/lib/trip';
import { Button } from '@/components/ui/button';

function Viewtrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  useEffect(() => {
    tripId && GetTripData();
  }, [tripId]);

  // Get trip from firebase
  const GetTripData = async () => {
    const localTrip = getLocalTrip(tripId);
    if (localTrip) {
      setTrip(localTrip);
      return;
    }

    try {
      const docRef = doc (db, 'AiTrips', tripId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTrip(docSnap.data());
      }
      else {
        toast('No trip found.');
      }
    } catch (error) {
      console.error(error);
      toast('Trip lookup failed in Firestore. If this was created locally, try generating it again in this browser.');
    }
  }
  if (!trip) {
    return <div className='p-10 text-center text-gray-500'>Loading trip...</div>;
  }

  return (
  <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
    <div className='mb-6 flex flex-wrap gap-3'>
      <Link to="/">
        <Button variant="outline">Back Home</Button>
      </Link>
      <Link to="/create-trip">
        <Button>Create Another Trip</Button>
      </Link>
    </div>
    {/* {Information Section} */}
    <InfoSection trip = {trip} />

    {/* {Recomended Hotels} */}
    <Hotels trip = {trip} />

    {/* {Display Plan} */}
    <PlacesToVisit trip = {trip} />

    {/* {Footer} */}
    <Footer/>

  </div>
  )
}

export default Viewtrip
