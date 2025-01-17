import mongoose, { Document, Schema } from 'mongoose'
import { UserRole } from '../constants/enums';


// interface for userschema
interface IUser extends Document {
    _id: string,
    firstName: string,
    LastName: string,
    email: string,
    phoneNumber: number,
    password?: string,
    role: UserRole,
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>({
    firstName: { type: String, required: true },
    LastName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: Number },
    password: { type: String },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },

},
    { timestamps: true }
)

export default mongoose.model<IUser>('User', userSchema)