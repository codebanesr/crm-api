import mongoose from "mongoose";
export const noteSchema = new mongoose.Schema({
    from: String,
    to: String,
    content: String
});
