import { RouterProvider, createBrowserRouter } from "react-router-dom"

import routes from "./routes"
import HomePage from "./home"

const router = createBrowserRouter(
  routes
    .map((route) => {
      return {
        path: route.path,
        element: <route.element />,
      }
    })
    .concat({
      path: "*",
      element: <HomePage />,
    })
)
function App() {
  return <RouterProvider router={router} />
}

export default App
