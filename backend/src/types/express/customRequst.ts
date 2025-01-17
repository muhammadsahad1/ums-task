import { Request as ExpressRequest } from 'express'

export default interface CustomRequest extends ExpressRequest {
    user?: {
        id: string;
        role?: string;
    }
}