import { Request, Response } from "express";
import PostUserModel from "../../models/post.model";
import { upload } from "../../utils/postupload.utils";


export class PostControllers {
  // Method to create a new post
  async add(req: Request, res: Response): Promise<any> {
    try {
      let user = req.user as any; 
      const userId=user._id;  
    //    console.log(req);
       
        
        if (!userId) {
            return res.status(400).json({message:'Please send user id.'})
        }

      
        const files = req.files as Express.Multer.File[];
        if (files.length > 8) {
            return res.status(400).json({ message: 'Only 8 files are allowed to upload.' });
        }

       
        const fileDocs = files.map(file => ({
            userId: userId,
            storage: file.filename
        }));

        await PostUserModel.insertMany(fileDocs);

        
        res.status(200).json({ message: 'Files uploaded and data saved successfully', files });
    } catch (error) {
        // console.error(error);
        res.status(500).json({ message: "Internal Server Error." });
    }
}
}

const PostController = new PostControllers();
export default PostController