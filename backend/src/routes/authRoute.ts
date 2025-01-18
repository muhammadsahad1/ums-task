import express from 'express'
import { login, logout } from '../controllers/authController'

const authRoute = express.Router()

// =================================== Auth Router =================================== //

authRoute.post('/login', login)
authRoute.post('/admin/logout',logout)

export default authRoute