import mongoose, {Schema} from 'mongoose';
import { IPosts } from '../types/post.type';




const PostSchema:Schema<IPosts>=new Schema(
    {
        userId:{
            type:Schema.Types.ObjectId,
            required:true,
        },
        storage:{
            type:String,
            required:true,
        }

    }
);
// const PostUserModel=mongoose.model<IPosts>('PostUser',PostSchema)
const PostUserModel=mongoose.model<IPosts>('Posts',PostSchema)
export default PostUserModel;
