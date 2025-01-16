import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { HttpStatus } from '../constants/enums'
import { StatusMessage } from '../constants/statusMessages'

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { auth_token } = req.cookies

        if (!auth_token) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                status: HttpStatus.UNAUTHORIZED,
                message: StatusMessage[HttpStatus.UNAUTHORIZED]
            })
        }
        // decoding token
        const decoded = jwt.verify(auth_token as string, process.env.JWT_SECRET as string) as JwtPayload

        req.userId = decoded._id

        next()

    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: StatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]
        })
    }
}