export function stripMarkdownJsonFence(value = "") {
  return value
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

export function parseTripResponse(rawText) {
  const cleaned = stripMarkdownJsonFence(rawText);
  const parsed = JSON.parse(cleaned);

  return {
    tripDetails: parsed.tripDetails ?? {},
    hotelOptions: Array.isArray(parsed.hotelOptions) ? parsed.hotelOptions : [],
    itinerary: parsed.itinerary && typeof parsed.itinerary === "object" ? parsed.itinerary : {},
  };
}

export function getLocationLabel(location) {
  if (!location) return "";
  if (typeof location === "string") return location;
  return location.label ?? "";
}

export function getBestTimeToVisit(info = {}) {
  return info.bestTimeToVisit ?? info.best_time_to_visit ?? "";
}

export function getMapQueryFromCoordinates(geoCoordinates) {
  if (!geoCoordinates || typeof geoCoordinates !== "object") return "";

  const latitude = geoCoordinates.latitude ?? geoCoordinates.lat;
  const longitude = geoCoordinates.longitude ?? geoCoordinates.lng;

  if (latitude == null || longitude == null) return "";

  return `${latitude},${longitude}`;
}

export function getOpenStreetMapUrl({ geoCoordinates, query }) {
  if (geoCoordinates && typeof geoCoordinates === "object") {
    const latitude = geoCoordinates.latitude ?? geoCoordinates.lat;
    const longitude = geoCoordinates.longitude ?? geoCoordinates.lng;

    if (latitude != null && longitude != null) {
      return `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=14/${latitude}/${longitude}`;
    }
  }

  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(query ?? "")}`;
}

export function saveTripToLocal(docId, trip) {
  const trips = JSON.parse(localStorage.getItem("localTrips") ?? "{}");
  trips[docId] = trip;
  localStorage.setItem("localTrips", JSON.stringify(trips));
}

export function getLocalTrip(docId) {
  const trips = JSON.parse(localStorage.getItem("localTrips") ?? "{}");
  return trips[docId] ?? null;
}

export function getAllLocalTrips() {
  const trips = JSON.parse(localStorage.getItem("localTrips") ?? "{}");

  return Object.values(trips).sort((a, b) => Number(b?.id ?? 0) - Number(a?.id ?? 0));
}

export function isQuotaError(error) {
  const status = error?.status ?? error?.response?.status;
  const message = error?.message ?? "";
  return status === 429 || message.includes("quota") || message.includes("Too Many Requests");
}

export function extractRetryDelay(error) {
  const message = error?.message ?? "";
  const match = message.match(/retry in\s+(\d+(?:\.\d+)?)s/i);
  return match ? Math.ceil(Number(match[1])) : null;
}

export function buildFallbackTrip({ location, noOfDays, budget, traveler }) {
  const totalDays = Math.max(1, Number(noOfDays) || 1);
  const itinerary = {};

  for (let day = 1; day <= totalDays; day += 1) {
    itinerary[`day${day}`] = {
      theme: day === 1 ? "Arrival and local highlights" : day === totalDays ? "Final day and relaxed wrap-up" : "City exploration and signature stops",
      bestTimeToVisit: day === 1 ? "Afternoon to evening" : "Morning to evening",
      places: [
        {
          placeName: `${location} City Center`,
          placeDetails: `Start with a flexible walk through the central part of ${location} to get oriented and discover food, landmarks, and transport connections.`,
          placeImageUrl: "",
          geoCoordinates: { latitude: 0, longitude: 0 },
          ticketPricing: "Free to explore",
          rating: "4.4",
          timeTravel: "15-20 minutes from your stay",
        },
        {
          placeName: `${location} Cultural Landmark`,
          placeDetails: `Visit one well-known cultural or historic attraction in ${location} and keep time for photos, short breaks, and nearby cafes.`,
          placeImageUrl: "",
          geoCoordinates: { latitude: 0, longitude: 0 },
          ticketPricing: budget === "Luxury" ? "Premium entry budget" : budget === "Moderate" ? "Standard entry budget" : "Choose a low-cost or free attraction",
          rating: "4.5",
          timeTravel: "20-30 minutes by local transit",
        },
        {
          placeName: `${location} Evening Leisure Spot`,
          placeDetails: `End the day with an easy evening stop such as a waterfront, market street, scenic viewpoint, or neighborhood restaurant cluster.`,
          placeImageUrl: "",
          geoCoordinates: { latitude: 0, longitude: 0 },
          ticketPricing: "Flexible",
          rating: "4.3",
          timeTravel: "10-20 minutes from the previous stop",
        },
      ],
    };
  }

  return {
    tripDetails: {
      location,
      duration: `${totalDays} Days`,
      budget,
      travelers: traveler,
      note: "Generated from the built-in fallback planner because the AI service was unavailable.",
    },
    hotelOptions: [
      {
        hotelName: `${location} Central Stay`,
        hotelAddress: `${location} main district`,
        price: budget === "Luxury" ? "$180 - $320 per night" : budget === "Moderate" ? "$90 - $180 per night" : "$35 - $90 per night",
        hotelImageUrl: "",
        geoCoordinates: { latitude: 0, longitude: 0 },
        rating: "4.2",
        descriptions: `A practical base in ${location} with access to food, transit, and common sightseeing areas.`,
      },
      {
        hotelName: `${location} Budget Comfort Hotel`,
        hotelAddress: `${location} transit-friendly area`,
        price: budget === "Luxury" ? "$220 - $380 per night" : budget === "Moderate" ? "$80 - $150 per night" : "$30 - $75 per night",
        hotelImageUrl: "",
        geoCoordinates: { latitude: 0, longitude: 0 },
        rating: "4.0",
        descriptions: "A simple option focused on value, commute convenience, and dependable basics.",
      },
    ],
    itinerary,
  };
}

export function withTimeout(promise, ms, message) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      window.setTimeout(() => reject(new Error(message)), ms);
    }),
  ]);
}
