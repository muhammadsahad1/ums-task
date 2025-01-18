import { NextFunction, Request as ExpressRequest, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { HttpStatus } from '../constants/enums'
import { StatusMessage } from '../constants/statusMessages'
import customRequest from '../types/express/customRequst'

export const authMiddleware = async (req: customRequest, res: Response, next: NextFunction): Promise<void> => {
    try {

        const { auth_token } = req.cookies
        // checking token is exists
        if (!auth_token) {
            res.status(HttpStatus.UNAUTHORIZED).json({
                status: HttpStatus.UNAUTHORIZED,
                message: StatusMessage[HttpStatus.UNAUTHORIZED]
            })
            return
        }
        // decoding token
        const decoded = jwt.verify(auth_token as string, process.env.JWT_SECRET as string) as JwtPayload
        if (!decoded) {
            res.status(HttpStatus.UNAUTHORIZED).json({
                status: HttpStatus.UNAUTHORIZED,
                message: StatusMessage[HttpStatus.UNAUTHORIZED]
            })
            return
        }
        // attaching id & role in req
        req.user = {
            id: decoded.id,
            role: decoded.role
        }

        next()

    } catch (error: any) {
        console.error("err in authMiddleware", error.message)
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: error
        })
        return
    }
}