import mongoose, { Document, Schema } from 'mongoose';
import { IModule } from './module.model'; // Import the Module interface

// Define the Permission interface
interface IPermission {
    module: mongoose.Types.ObjectId | IModule;
    permissions: Array<'GET' | 'POST' | 'DELETE' | 'PUT'>;
}

// Define the Role interface extending mongoose Document
export interface IRole extends Document {
    name: string;
    description?: string;
    permissions: IPermission[];
}

// Define the Role schema
const roleSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: false
    },
    permissions: [
        {
            module: {
                type: Schema.Types.ObjectId,
                ref: 'Module',
                required: true
            },
            permissions: {
                type: [String],
                enum: ['GET', 'POST', 'DELETE', 'PUT'],
                required: true
            }
        }
    ]
});

// Create the Role model
const Role = mongoose.model<IRole>('Role', roleSchema);

export default Role;
