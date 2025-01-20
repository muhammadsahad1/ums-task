import { NextFunction, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { HttpStatus } from '../constants/enums';
import { StatusMessage } from '../constants/statusMessages';
import customRequest from '../types/express/customRequst';

export const authMiddleware = async (req: customRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        
        const access_token = req.headers.auth as string;

        if (!access_token) {
            res.status(HttpStatus.UNAUTHORIZED).json({
                status: HttpStatus.UNAUTHORIZED,
                message: StatusMessage[HttpStatus.UNAUTHORIZED],
            });
            return
        }

        const decoded = jwt.verify(access_token, process.env.JWT_SECRET as string) as JwtPayload;
        if (!decoded) {
            res.status(HttpStatus.UNAUTHORIZED).json({
                status: HttpStatus.UNAUTHORIZED,
                message: StatusMessage[HttpStatus.UNAUTHORIZED],
            });
            return
        }

        req.user = {
            id: decoded.id,
            role: decoded.role,
        };

        next();
    } catch (error: any) {
        console.error("Error in authMiddleware:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
};
