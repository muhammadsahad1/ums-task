import mongoose from 'mongoose'

export const mongoConnection = async () => {
    try {
        // Ensure the MONGO_URL is available in the environment variables
        if (!process.env.MONGO_URL) {
            throw new Error('MONGO_URL environment variable is not defined');
        }
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Successfully connected to MongoDB');
    } catch (error: any) {

        console.error('Error in MongoDB connection:', error.message);

    }
}


