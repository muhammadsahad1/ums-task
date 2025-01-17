import { Request, Response } from "express"
import User from "../models/User"
import { HttpStatus, UserRole } from "../constants/enums"
import { StatusMessage } from "../constants/statusMessages"

// ===================================> Users Controller <==================================== //

export const createUser = async (req: Request, res: Response) => {
    try {
        // Destructuring the request body
        const { firstName, lastName, email, phoneNumber, role } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !phoneNumber || !role) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                message: StatusMessage[HttpStatus.BAD_REQUEST]
            });
        }

        // Check if user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(HttpStatus.CONFLICT).json({
                status: HttpStatus.CONFLICT,
                message: StatusMessage[HttpStatus.CONFLICT]
            });
        }

        // Create a new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            phoneNumber,
            role: role || UserRole.USER
        });

        // Save the user to the database
        const savedUser = await newUser.save();

        return res.status(HttpStatus.CREATED).json({
            status: HttpStatus.CREATED,
            message: StatusMessage[HttpStatus.CREATED],
            data: savedUser
        });

    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: StatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]
        });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        if (!req.user?.id) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                status: HttpStatus.UNAUTHORIZED,
                message: StatusMessage[HttpStatus.UNAUTHORIZED]
            })
        }
        // checking requesting user is admin or not 
        const isAdmin = await User.findById(req.user?.id)
        if (!isAdmin || isAdmin.role !== UserRole.ADMIN) {
            return res.status(HttpStatus.FORBIDDEN).json({
                status: HttpStatus.FORBIDDEN,
                message: StatusMessage[HttpStatus.FORBIDDEN]
            })
        }
        // for pagination calc
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 5
        const skip = (page - 1) * limit

        // getting users & checking users exists or not
        const users = await User.find({ _id: { $ne: req.user.id } }).limit(limit).skip(skip)
        if (users.length === 0) {
            return res.status(HttpStatus.NOT_FOUND).json({
                status: HttpStatus.NOT_FOUND,
                message: StatusMessage[HttpStatus.NOT_FOUND]
            })
        }
        // counts of users
        const totalUsers = await User.countDocuments({ _id: { $ne: req.user.id } });

        return res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: StatusMessage[HttpStatus.OK],
            data: users,
            pagination: {
                totalUsers,
                currentPage: page,
                totalPage: Math.ceil(totalUsers / limit),
                pageSize: limit
            }
        })

    } catch (error) {
        console.log("err in getUsers", error)
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: StatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]
        })

    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        // checking user_id in params
        if (!req.params.user_id) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                message: StatusMessage[HttpStatus.BAD_REQUEST]
            })
        }
        // destructring
        const { user_id } = req.params
        const { firstName, lastName, email, phoneNumber } = req.body
        // checking user is exists or not 
        const user = await User.findById(user_id)
        if (!user) {
            return res.status(HttpStatus.NOT_FOUND).json({
                status: HttpStatus.NOT_FOUND,
                message: StatusMessage[HttpStatus.NOT_FOUND]
            })
        }
        // updating corresponding user &  return updated user
        const updatedUser = await User.findByIdAndUpdate(user_id, {
            $set: {
                firstName: firstName || user.firstName,
                LastName: lastName || user.LastName,
                email: email || user.email,
                phoneNumber: phoneNumber || user.phoneNumber
            }
        }, { new: true })

        return res.status(HttpStatus.CREATED).json({
            status: HttpStatus.CREATED,
            message: StatusMessage[HttpStatus.CREATED],
            data: updatedUser
        })
    } catch (error) {
        console.log("err in getUsers", error)
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: StatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]
        })
    }
}


export const deleteUser = async (req: Request, res: Response) => {
    try {
        if (!req.params.user_id) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                message: StatusMessage[HttpStatus.BAD_REQUEST]
            })
        }
        const { user_id } = req.params
        const user = await User.findById(user_id)

        if (!user) {
            return res.status(HttpStatus.NOT_FOUND).json({
                status: HttpStatus.NOT_FOUND,
                message: StatusMessage[HttpStatus.NOT_FOUND]
            })
        }

        // Check if the user is an admin (if applicable)
        if (user.role === UserRole.ADMIN) {
            return res.status(HttpStatus.FORBIDDEN).json({
                status: HttpStatus.FORBIDDEN,
                message: StatusMessage[HttpStatus.FORBIDDEN]
            });
        }
        // deleting user 
        await User.findByIdAndDelete(user_id)

        return res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: StatusMessage[HttpStatus.OK]
        })

    } catch (error) {
        console.error("err in deleting user", error)
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: StatusMessage[HttpStatus.INTERNAL_SERVER_ERROR]
        });
    }
}