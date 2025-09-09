import { createBrowserRouter } from "react-router-dom"
import LandingPage from "../pages/LandingPage"
import UserAccount from "../pages/UserAccount"
import PaginaCustomizaçao from "../pages/PaginaCustomizaçao"

const router = createBrowserRouter([

    {path: "/", element: <LandingPage/>},
    {path: "/custom", element: <PaginaCustomizaçao/>},
    {path: "/usuario", element: <UserAccount/>}

])

export default router