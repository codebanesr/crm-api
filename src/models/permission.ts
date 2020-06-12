import mongoose from "mongoose";
// add a lead priority index [An enum variable with list of priorities]
const permissionSchema = new mongoose.Schema({
    label: { type: String, required: true },
    value: { type: String, required: true },
    checked: { type: Boolean, required: true }

}, {
    timestamps: true,
    autoIndex: true
});

export default mongoose.model("Permission", permissionSchema);