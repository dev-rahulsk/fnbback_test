import mongoose, { Document, Schema } from "mongoose";
import { IAdmin } from "../types/admin.type";

const AdminSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: Schema.Types.ObjectId, ref: "Role", required: false },
    name: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "Admin", required: false },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Admin", required: false },
  },
  { timestamps: true }
);

const Admin = mongoose.model<IAdmin>("Admin", AdminSchema);
export default Admin;
