import mongoose, { Document, Schema } from 'mongoose';

// Define the Module interface extending mongoose Document
export interface IModule extends Document {
    name: string;
    description?: string;
}

// Define the Module schema
const moduleSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: false
    }
});

// Create the Module model
const Module = mongoose.model<IModule>('Module', moduleSchema);

export default Module;