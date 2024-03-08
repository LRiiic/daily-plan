import { useState } from 'react'
import DailyPlanLogo from '/dailyplan-logo.svg'
import NavBar from './components/navBar'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/home'
import NotFound from './pages/notFound'
import FormTask from './pages/formTask'

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,

      children: [
        {
          path: "/new-task",
          element: <FormTask />
        },
        {
          path: "/edit-task/:id",
          element: <FormTask />
        },
      ],
    },
    { path: "*", element: <NotFound /> }
  ]);

  return <div className='mainContainer'><RouterProvider router={router} /></div>
}

export default App
