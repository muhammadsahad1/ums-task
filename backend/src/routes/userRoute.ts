import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware'
import { adminAuthMiddlware } from '../middleware/adminAuthMiddleware'

const router = express.Router()

// =================================== User Router =================================== //

router.get('/users',authMiddleware,adminAuthMiddlware)