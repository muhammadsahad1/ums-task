import express from 'express'
import { login } from '../controllers/authController'

const authRoute = express.Router()

// =================================== Auth Router =================================== //

authRoute.post('/login', login)

export default authRoute