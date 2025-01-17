import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware'
import { adminAuthMiddlware } from '../middleware/adminAuthMiddleware'
import { createUser, deleteUser, getUsers, updateUser } from '../controllers/userController'

const userRoute = express.Router()

// =================================== User Router =================================== //

userRoute.get('/users', authMiddleware, adminAuthMiddlware, getUsers)
userRoute.post('/user', authMiddleware, adminAuthMiddlware, createUser)
userRoute.put('/user/update/:user_id', authMiddleware, adminAuthMiddlware, updateUser)
userRoute.delete('/user/delete/:user_id', authMiddleware, adminAuthMiddlware, deleteUser)

export default userRoute