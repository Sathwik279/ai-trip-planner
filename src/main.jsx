import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import CreateTrip from './create-trip/index.jsx'
import Header from './components/custom/Header.jsx'
import { Toaster } from './components/ui/sonner'
import Viewtrip from './view-trip/[tripId]/index.jsx'
import MyTrips from './my-trips/index.jsx'

function RootLayout() {
  return (
    <>
      <Header />
      <Toaster />
      <Outlet />
    </>
  )
}

const router = createBrowserRouter ([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: 'create-trip',
        element: <CreateTrip />,
      },
      {
        path: 'my-trips',
        element: <MyTrips />,
      },
      {
        path: 'view-trip/:tripId',
        element: <Viewtrip/>
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router = {router} />
  </React.StrictMode>,
)
