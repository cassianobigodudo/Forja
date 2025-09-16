import { createBrowserRouter } from "react-router-dom"
import LandingPage from "../pages/LandingPage"
import UserAccount from "../pages/UserAccount"
import PaginaCustomizaçao from "../pages/PaginaCustomizaçao"
import PaginaPagamento from "../pages/PaginaPagamento"

const router = createBrowserRouter([

    {path: "/", element: <LandingPage/>},
    {path: "/custom", element: <PaginaCustomizaçao/>},
    {path: "/usuario", element: <UserAccount/>},
    {path: "/pagamento", element: <PaginaPagamento/>}
   
])

export default router