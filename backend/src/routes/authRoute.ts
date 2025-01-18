import express from 'express'
import { login, logout } from '../controllers/authController'
import { adminAuthMiddlware } from '../middleware/adminAuthMiddleware'
import { authMiddleware } from '../middleware/authMiddleware'

const authRoute = express.Router()

// =================================== Auth Router =================================== //

authRoute.post('/login', login)
authRoute.post('/admin/logout', authMiddleware, adminAuthMiddlware, logout)

export default authRoute