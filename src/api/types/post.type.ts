// import mongoose from "mongoose";

import mongoose from "mongoose";

// // Define Post Interface
// export interface IPost extends Document {
//   userId: mongoose.Schema.Types.ObjectId;
//   media: Array<{
//     type: string;
//     storage: string;
//   }>;
// }
export interface IPosts extends Document{
  userId:mongoose.Schema.Types.ObjectId;
  storage:string;
}