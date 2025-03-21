import ThemeManager from './components/themeManager'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/home'
import NotFound from './pages/notFound'

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    { path: "*", element: <NotFound /> }
  ]);

  return (
    <div className='mainContainer'>
        <RouterProvider router={router} />
    </div>
  );
}

export default App
