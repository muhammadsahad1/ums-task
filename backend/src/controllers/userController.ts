import { Request, Response } from "express"
import User from "../models/User"
import { HttpStatus, UserRole } from "../constants/enums"
import { StatusMessage } from "../constants/statusMessages"
import customRequest from '../types/express/customRequst'

// ===================================> Users Controller <==================================== //

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        // Destructuring the request body
        const { firstName, lastName, email, phoneNumber } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !phoneNumber) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                message: StatusMessage[HttpStatus.BAD_REQUEST]
            });
            return;
        }

        // Check if user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(HttpStatus.CONFLICT).json({
                status: HttpStatus.CONFLICT,
                message: StatusMessage[HttpStatus.CONFLICT]
            });
            return;
        }

        // Create a new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            phoneNumber,
            role: UserRole.USER
        });

        // Save the user to the database
        const savedUser = await newUser.save();

        res.status(HttpStatus.CREATED).json({
            status: HttpStatus.CREATED,
            message: StatusMessage[HttpStatus.CREATED],
            data: savedUser
        });
        return;

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: StatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]
        });
        return;
    }
};

export const getUsers = async (req: customRequest, res: Response): Promise<void> => {
    try {
        if (!req.user?.id) {
            res.status(HttpStatus.UNAUTHORIZED).json({
                status: HttpStatus.UNAUTHORIZED,
                message: StatusMessage[HttpStatus.UNAUTHORIZED]
            });
            return;
        }
        // checking requesting user is admin or not 
        const isAdmin = await User.findById(req.user?.id);
        if (!isAdmin || isAdmin.role !== UserRole.ADMIN) {
            res.status(HttpStatus.FORBIDDEN).json({
                status: HttpStatus.FORBIDDEN,
                message: StatusMessage[HttpStatus.FORBIDDEN]
            });
            return;
        }

        // Pagination calculation
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 5;
        const skip = (page - 1) * limit;

        // Getting users & checking if users exist
        const users = await User.find({ _id: { $ne: req.user.id } }).limit(limit).skip(skip).sort({ createdAt: -1 })
        if (users.length === 0) {
            res.status(HttpStatus.NOT_FOUND).json({
                status: HttpStatus.NOT_FOUND,
                message: StatusMessage[HttpStatus.NOT_FOUND]
            });
            return;
        }

        // Count of users
        const totalUsers = await User.countDocuments({ _id: { $ne: req.user.id } });

        res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: StatusMessage[HttpStatus.OK],
            data: users,
            pagination: {
                totalUsers,
                currentPage: page,
                totalPage: Math.ceil(totalUsers / limit),
                pageSize: limit
            }
        });
        return;

    } catch (error) {
        console.log("Error in getUsers", error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: StatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]
        });
        return;
    }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        // Checking user_id in params
        if (!req.params.user_id) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                message: StatusMessage[HttpStatus.BAD_REQUEST]
            });
            return;
        }

        // Destructuring
        const { user_id } = req.params;
        const { firstName, lastName, email, phoneNumber } = req.body;
        
        // Checking if user exists
        const user = await User.findById(user_id);
        if (!user) {
            res.status(HttpStatus.NOT_FOUND).json({
                status: HttpStatus.NOT_FOUND,
                message: StatusMessage[HttpStatus.NOT_FOUND]
            });
            return;
        }

        // Updating corresponding user & returning updated user
        const updatedUser = await User.findByIdAndUpdate(user_id, {
            $set: {
                firstName: firstName || user.firstName,
                lastName: lastName || user.lastName,
                email: email || user.email,
                phoneNumber: phoneNumber || user.phoneNumber
            }
        }, { new: true });

        res.status(HttpStatus.CREATED).json({
            status: HttpStatus.CREATED,
            message: StatusMessage[HttpStatus.CREATED],
            data: updatedUser
        });
        return;

    } catch (error) {
        console.log("Error in updateUser", error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: StatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]
        });
        return;
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.params.user_id) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                message: StatusMessage[HttpStatus.BAD_REQUEST]
            });
            return;
        }

        const { user_id } = req.params;
        const user = await User.findById(user_id);

        if (!user) {
            res.status(HttpStatus.NOT_FOUND).json({
                status: HttpStatus.NOT_FOUND,
                message: StatusMessage[HttpStatus.NOT_FOUND]
            });
            return;
        }

        // Check if the user is an admin
        if (user.role === UserRole.ADMIN) {
            res.status(HttpStatus.FORBIDDEN).json({
                status: HttpStatus.FORBIDDEN,
                message: StatusMessage[HttpStatus.FORBIDDEN]
            });
            return;
        }

        // Deleting user
        await User.findByIdAndDelete(user_id);

        res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: StatusMessage[HttpStatus.OK]
        });
        return;

    } catch (error) {
        console.error("Error in deleting user", error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: StatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]
        });
        return;
    }
};
