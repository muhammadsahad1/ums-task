import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { HttpStatus } from '../constants/enums'
import { StatusMessage } from '../constants/statusMessages'

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    } catch (error) {
        console.error("err in authMiddleware", error)
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: StatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]
        })
        return
    }
}