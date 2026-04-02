import axios from "axios"

const pexelsApiKey = import.meta.env.VITE_PEXELS_API_KEY;
const pexelsPhotoCache = new Map();

export const getPlaceSuggestions = (input) =>
  axios.get(
    'https://nominatim.openstreetmap.org/search',
    {
      params: {
        q: input,
        format: 'jsonv2',
        addressdetails: 1,
        limit: 5,
      }
    }
  )

export async function getPexelsPhoto(query) {
  const normalizedQuery = query?.trim();

  if (!normalizedQuery || !pexelsApiKey) {
    return null;
  }

  if (pexelsPhotoCache.has(normalizedQuery)) {
    return pexelsPhotoCache.get(normalizedQuery);
  }

  try {
    const response = await axios.get('https://api.pexels.com/v1/search', {
      params: {
        query: normalizedQuery,
        per_page: 1,
        orientation: 'landscape',
      },
      headers: {
        Authorization: pexelsApiKey,
      },
    });

    const photoUrl = response.data?.photos?.[0]?.src?.medium || response.data?.photos?.[0]?.src?.large || null;
    pexelsPhotoCache.set(normalizedQuery, photoUrl);
    return photoUrl;
  } catch (error) {
    console.error(error);
    pexelsPhotoCache.set(normalizedQuery, null);
    return null;
  }
}
