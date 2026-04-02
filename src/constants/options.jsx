export const SelectTravelList=[
    {
        id:1,
        title:'Just Me',
        desc:"A sole traveles",
        icon:'🙋🏾‍♀️',
        people:'1',
    },
    {
        id:2,
        title:'A couple',
        desc:"Two travelers",
        icon:'👫🏾',
        people:'2',
    },
    {
        id:3,
        title:'Family',
        desc:"A group of fun loving adv",
        icon:'🏡',
        people:'3 to 5 people',
    },
    {
        id:4,
        title:'Friends',
        desc:"A bunch of thrill-seekers",
        icon:'👩‍👩‍👦‍👦',
        people:'5 to 12 people',
    },
]

export const SelectBudgetOptions=[
    {
        id:1,
        title:'Cheap',
        desc:"Stay conscious of costs",
        icon:'💵',
    },
    {
        id:2,
        title:'Moderate',
        desc:"Keep cost on the average side",
        icon:'💰',
    },
    {
        id:3,
        title:'Luxury',
        desc:"Don't worry about cost",
        icon:'💎',
    },
]


export const AI_PROMPT=`Generate a travel plan in valid JSON only.
Destination: {location}
Trip length: {totalDays} days
Travelers: {traveler}
Budget: {budget}

Return this exact top-level structure:
{
  "tripDetails": {},
  "hotelOptions": [
    {
      "hotelName": "",
      "hotelAddress": "",
      "price": "",
      "hotelImageUrl": "",
      "geoCoordinates": { "latitude": 0, "longitude": 0 },
      "rating": "",
      "descriptions": ""
    }
  ],
  "itinerary": {
    "day1": {
      "theme": "",
      "bestTimeToVisit": "",
      "places": [
        {
          "placeName": "",
          "placeDetails": "",
          "placeImageUrl": "",
          "geoCoordinates": { "latitude": 0, "longitude": 0 },
          "ticketPricing": "",
          "rating": "",
          "timeTravel": ""
        }
      ]
    }
  }
}

Do not wrap the JSON in markdown fences.`;
