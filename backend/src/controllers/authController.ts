import { Request, Response } from 'express'
import User from "../models/User"
import { HttpStatus, UserRole } from '../constants/enums'
import { StatusMessage } from '../constants/statusMessages'
import jwt from 'jsonwebtoken'
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
        const admin = await User.findOne({ email }).select('-password');

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
        if (!isPasswordValid) {
            res.status(HttpStatus.UNAUTHORIZED).json({
                status: HttpStatus.UNAUTHORIZED,
                message: StatusMessage[HttpStatus.UNAUTHORIZED],
            });
            return;
        }

        // Create JWT token
        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );

        // Set the token as a cookie
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        // Send the response with status 200 (OK)
        res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: StatusMessage[HttpStatus.OK],
            data: admin,
        });
    } catch (error) {
        console.error(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: StatusMessage[HttpStatus.INTERNAL_SERVER_ERROR],
        });
    }
};
