import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { AI_PROMPT, SelectBudgetOptions, SelectTravelList } from '@/constants/options';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { chatSession } from '@/service/AIModal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "@/service/firebaseConfig";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom"
import { getPlaceSuggestions } from '@/service/GlobalApi';
import {
  buildFallbackTrip,
  extractRetryDelay,
  isQuotaError,
  parseTripResponse,
  saveTripToLocal,
  withTimeout,
} from '@/lib/trip';

function CreateTrip() {
  const [formData, setFormData] = useState({
    location: '',
    noOfDays: '',
    budget: '',
    traveler: '',
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const query = formData.location.trim();

    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      try {
        setSuggestionsLoading(true);
        const response = await getPlaceSuggestions(query);
        const nextSuggestions = (response.data ?? [])
          .map((item) => item.display_name)
          .filter(Boolean)
          .slice(0, 5);
        setSuggestions(nextSuggestions);
      } catch (error) {
        console.error(error);
        setSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [formData.location]);

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      localStorage.setItem(
        'user',
        JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          picture: result.user.photoURL,
        }),
      );
      setOpenDialog(false);
    } catch (error) {
      console.error(error);
      toast("Google sign-in is not configured in Firebase yet. Enable Google in Firebase Authentication.")
    }
  }

  const OnGenerateTrip = async () => {
    if (!formData.location || !formData.noOfDays || !formData.budget || !formData.traveler) {
      toast("Please fill all details.")
      return;
    }

    if (Number(formData.noOfDays) > 10) {
      toast("Please choose 10 days or fewer for best results.")
      return;
    }

    setLoading(true);
    const finalPrompt = AI_PROMPT
      .replace('{location}', formData.location)
      .replace('{totalDays}', formData.noOfDays)
      .replace('{traveler}', formData.traveler)
      .replace('{budget}', formData.budget)

    try {
      const result = await withTimeout(
        chatSession.sendMessage(finalPrompt),
        25000,
        "AI generation took too long. A fallback trip will be created instead.",
      );
      const tripData = parseTripResponse(result?.response?.text() ?? '');
      await SaveAiTrip(tripData);
      toast("Trip generated successfully.")
    } catch (error) {
      console.error(error);

      if (isQuotaError(error) || error?.message?.includes("fallback trip")) {
        const retryAfterSeconds = extractRetryDelay(error);
        const fallbackTrip = buildFallbackTrip(formData);
        await SaveAiTrip(fallbackTrip);
        toast(
          retryAfterSeconds
            ? `The AI service is unavailable right now. A fallback trip was created locally. Try again in about ${retryAfterSeconds} seconds.`
            : "The AI service is unavailable right now. A fallback trip was created locally.",
        )
        return;
      }

      toast("We couldn't generate the trip. Please try again.")
    } finally {
      setLoading(false);
    }
  }

  const SaveAiTrip = async (tripData) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const docId = Date.now().toString();
    const tripRecord = {
      userSelection: formData,
      tripData,
      userEmail: user?.email ?? null,
      id: docId
    };

    saveTripToLocal(docId, tripRecord);

    try {
      await withTimeout(
        setDoc(doc(db, "AiTrips", docId), tripRecord),
        5000,
        "Firestore sync timed out.",
      );
    } catch (error) {
      console.error(error);
      if (error?.code === 'permission-denied' || error?.message?.includes('insufficient permissions')) {
        toast("Saved locally. Firestore blocked the write because your database rules do not allow this app to write yet.")
      } else {
        toast("Saved locally. Firestore sync failed, so this trip is available only in this browser for now.")
      }
    }

    navigate('/view-trip/' + docId);
  }

  return (
    <div className='mx-auto mt-10 max-w-5xl px-5 pb-16 sm:px-10 md:px-16'>
      <h2 className='font-bold text-3xl'>Tell us your travel preferences</h2>
      <p className='mt-3 text-xl text-gray-500'>Share a few details and we will generate a focused itinerary you can save and revisit.</p>
      <div className='mt-12 flex flex-col gap-9'>
        <div className='relative'>
          <h2 className='my-3 text-xl font-medium'>What is destination of choice?</h2>
          <Input
            placeholder='Ex. Hyderabad, Paris, Bali'
            value={formData.location}
            onChange={(e) => {
              handleInputChange('location', e.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              window.setTimeout(() => setShowSuggestions(false), 150)
            }}
          />
          {showSuggestions && (suggestionsLoading || suggestions.length > 0) ? (
            <div className='absolute z-10 mt-2 w-full rounded-lg border bg-white shadow-lg'>
              {suggestionsLoading ? (
                <p className='px-4 py-3 text-sm text-gray-500'>Loading places from OpenStreetMap...</p>
              ) : (
                suggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion}-${index}`}
                    type="button"
                    className='block w-full border-b px-4 py-3 text-left text-sm hover:bg-gray-50 last:border-b-0'
                    onMouseDown={() => {
                      handleInputChange('location', suggestion)
                      setShowSuggestions(false)
                    }}
                  >
                    {suggestion}
                  </button>
                ))
              )}
            </div>
          ) : null}
        </div>
        <div>
          <h2 className='my-3 text-xl font-medium'>How many days are you planning trip?</h2>
          <Input
            placeholder='Ex. 3'
            type="number"
            min="1"
            max="10"
            value={formData.noOfDays}
            onChange={(e) => handleInputChange('noOfDays', e.target.value)}
          />
        </div>
        <div>
          <h2 className='my-3 text-xl font-medium'>What is your budget?</h2>
          <div className='grid gap-5 md:grid-cols-3'>
            {SelectBudgetOptions.map((item) => (
              <div
                key={item.id}
                onClick={() => handleInputChange('budget', item.title)}
                className={`rounded-lg border p-4 transition hover:shadow-lg ${formData?.budget === item.title ? 'border-black shadow-lg' : ''}`}
              >
                <h2 className='text-4xl'>{item.icon}</h2>
                <h2 className='text-lg font-bold'>{item.title}</h2>
                <h2 className='text-sm text-gray-500'>{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className='my-3 text-xl font-medium'>Who do you plan on travelling with on your next adventure?</h2>
          <div className='grid gap-5 md:grid-cols-2 lg:grid-cols-4'>
            {SelectTravelList.map((item) => (
              <div
                key={item.id}
                onClick={() => handleInputChange('traveler', item.people)}
                className={`rounded-lg border p-4 transition hover:shadow-lg ${formData?.traveler === item.people ? 'border-black shadow-lg' : ''}`}
              >
                <h2 className='text-4xl'>{item.icon}</h2>
                <h2 className='text-lg font-bold'>{item.title}</h2>
                <h2 className='text-sm text-gray-500'>{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="my-10 flex justify-end">
        <Button onClick={OnGenerateTrip} disabled={loading}>
          {loading ? <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" /> : 'Generate Trip'}
        </Button>
      </div>

      <div className='rounded-xl border bg-white/70 p-4 text-sm text-gray-600'>
        Google sign-in is optional. If Firebase Authentication is enabled for your project, you can sign in to sync plans to Firestore.
        <Button variant="outline" className='ml-3' onClick={() => setOpenDialog(true)}>
          Sign in with Google
        </Button>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <img src="/logo.svg" className='h-10' />
            <DialogTitle className='mt-4'>Sign in with Google</DialogTitle>
            <DialogDescription>
              Sign in to sync generated trips to Firebase. If sign-in is not configured yet, you can still generate trips and keep them locally in this browser.
            </DialogDescription>
            <Button
              onClick={login}
              className="mt-5 flex w-full items-center gap-4"
            >
              <FcGoogle className='h-5 w-5' />
              Sign in with Google
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateTrip
