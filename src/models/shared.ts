import mongoose from "mongoose";
export const reassignmentSchema = new mongoose.Schema({
    from: String,
    to: String,
    content: String
});
