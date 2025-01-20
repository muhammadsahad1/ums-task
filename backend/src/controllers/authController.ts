import { Request, Response } from 'express'
import User from "../models/User"
import { HttpStatus, UserRole } from '../constants/enums'
import { StatusMessage } from '../constants/statusMessages'
import jwt, { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcrypt'

// ===========================> Auth Controller <======================== //

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Check if the email and password are provided
        if (!email || !password) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                message: StatusMessage[HttpStatus.BAD_REQUEST],
            });
            return;
        }

        // Find the user with the provided email
        const admin = await User.findOne({ email });

        // If user not found or not an admin
        if (!admin || admin.role !== UserRole.ADMIN) {
            res.status(HttpStatus.NOT_FOUND).json({
                status: HttpStatus.NOT_FOUND,
                message: StatusMessage[HttpStatus.NOT_FOUND],
            });
            return;
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, admin.password ?? '');
        console.log(isPasswordValid)
        if (!isPasswordValid) {
            res.status(HttpStatus.UNAUTHORIZED).json({
                status: HttpStatus.UNAUTHORIZED,
                message: StatusMessage[HttpStatus.UNAUTHORIZED],
            });
            return;
        }

        // Create JWT token
        const access_token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '10m' }
        );
        // generating refreshtoken
        const refresh_token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET as string,
            { expiresIn: '10h' })

        const adminData = admin.toObject()
        delete adminData.password

        // // Set the token as a cookie
        // res.cookie('auth_token', token, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',
        //     sameSite: 'strict'
        // });

        // res.cookie('auth_refresh_token', refreshToken, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',
        //     sameSite: 'strict'
        // })

        // Send the response with status 200 (OK)
        res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: StatusMessage[HttpStatus.OK],
            data: adminData,
            tokens: { access_token, refresh_token } // here sending both tokens 
        });
    } catch (error) {
        console.error(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: StatusMessage[HttpStatus.INTERNAL_SERVER_ERROR],
        });
    }
};




export const handlingRefreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refresh_token } = req.body;

        if (!refresh_token) {
            res.status(HttpStatus.UNAUTHORIZED).json({
                status: HttpStatus.UNAUTHORIZED,
                message: StatusMessage[HttpStatus.UNAUTHORIZED],
            });
            return
        }
        // decoding
        const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET as string) as JwtPayload;
        if (!decoded) {
            res.status(HttpStatus.UNAUTHORIZED).json({
                status: HttpStatus.UNAUTHORIZED,
                message: StatusMessage[HttpStatus.UNAUTHORIZED],
            });
            return
        }

        const newAccessToken = jwt.sign(
            { id: decoded.id as string, role: decoded.role as string },
            process.env.JWT_SECRET as string,
            { expiresIn: '15m' }
        );

        res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            access_token: newAccessToken,
        });
    } catch (error: any) {
        console.error("Error in handlingRefreshToken:", error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
};



export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        // Clear the auth token from the cookies
        // res.clearCookie('auth_token', {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',
        //     sameSite: 'strict'
        // });

        res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: StatusMessage[HttpStatus.OK],
            data: { message: 'Logout successful' },
        });

    } catch (error) {
        console.error(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: StatusMessage[HttpStatus.INTERNAL_SERVER_ERROR],
        });
    }
};