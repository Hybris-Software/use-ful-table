import ClientPaginated from "./pages/client-paginated"
import ServerPaginated from "./pages/server-paginated"
import NotPaginated from "./pages/not-paginated"

export default [
  {
    path: "/client-paginated",
    element: ClientPaginated,
    name: "Client Side Paginated",
  },
  {
    path: "/server-paginated",
    element: ServerPaginated,
    name: "Server Side Paginated",
  },
  {
    path: "/not-paginated",
    element: NotPaginated,
    name: "Not Paginated",
  },
]
