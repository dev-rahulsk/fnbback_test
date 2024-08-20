import multer from 'multer';
import path from 'path';
import fs from 'fs'

export const BASE_UPLOADS_DIR = path.join(__dirname, '..','..','..','build','uploads').toString();

export const baseUrl=(storage:string):string=>{

    return path.join(BASE_UPLOADS_DIR, storage)
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        
        const userId = (req.user as any)._id.toString(); // or `as UserType` if you have a defined UserType

        if(!userId){
            return cb(new Error('Invalid user ID'),"");
        }
        
        const userFolder = path.join(__dirname, '../../../build/uploads', userId);
        const postsFolder = path.join(userFolder, 'posts');

       
        if (!fs.existsSync(userFolder)) {
            fs.mkdirSync(userFolder, { recursive: true });
        }
        if (!fs.existsSync(postsFolder)) {
            fs.mkdirSync(postsFolder, { recursive: true });
        }

        
        cb(null, postsFolder);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});



function checkFileType(file: Express.Multer.File, cb: multer.FileFilterCallback){
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error("Error: Images only."));
    }
}


export const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10 MB limit
    fileFilter: (req, file, cb) => {
        
        checkFileType(file, cb);
    }
}).array('files', 8); // Accept up to 8 files

