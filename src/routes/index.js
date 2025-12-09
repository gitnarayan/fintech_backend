import express from 'express'
const router = express.Router()
import authRoute from './authRoute.js'
import userRoute from './userRoute.js'
import mutualFundRoute from './mutualFundRoute.js'
import panRoute from "./panRoute.js";
import nseRoutes from "./nseOrder.route.js";
import nseSip from "./nseSip.routes.js";
import nseAuthRoute from "./auth.routes.js";
// import religionRoute from './religionRoute.js'
const defaultRoute = [
    { path: '/auth', route: authRoute, },
    { path: '/user', route: userRoute, },
    { path: '/mutual-fund', route: mutualFundRoute, },
    { path: "/pan", route: panRoute },
    { path: "/nse", route: nseRoutes },
    { path: "/sip", route: nseSip },
    { path: "/", route: nseAuthRoute },
    // { path: '/religion', route: religionRoute, },}

]
defaultRoute.forEach((route) => {
    router.use(route.path, route.route)
})
export default router