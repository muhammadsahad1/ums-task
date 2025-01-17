import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { HttpStatus } from '../constants/enums'
import { StatusMessage } from '../constants/statusMessages'
import customRequest from '../types/express/customRequst'

export const adminAuthMiddlware = async (req: customRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        // checking the role is admin or not
        if (!req.user || req.user.role !== "admin") {
            res.status(HttpStatus.UNAUTHORIZED).json({
                status: HttpStatus.UNAUTHORIZED,
                message: StatusMessage[HttpStatus.UNAUTHORIZED]
            })
            return
        }

        next()
    } catch (error) {
        console.error("err in admin auth middlware", error)
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: StatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]
        })
        return
    }
}