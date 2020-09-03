import { Schema } from 'mongoose';
// add a lead priority index [An enum variable with list of priorities]
export const RoleSchema = new Schema({
    _id: { type: String, required: true },
    value: String,
    label: String,
    permissions: [
        {
            label: String,
            value: String,
            checked: Boolean
        }
    ]
}, {
    timestamps: true,
    autoIndex: true
});
